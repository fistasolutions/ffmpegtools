`route.ts`

```bash
import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import { v2 as cloudinary } from 'cloudinary';

// Initialize Cloudinary configuration
cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
    api_secret: process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET,
});

// Function to download a video from an external URL
const downloadVideo = async (url: string): Promise<Buffer> => {
    try {
        // Validate the URL before making the request
        if (!url || !url.startsWith('http')) {
            throw new Error('Invalid URL provided');
        }

        const response = await axios.get(url, { responseType: 'arraybuffer' });
        return Buffer.from(response.data);
    } catch (error: any) {
        console.error('Error downloading video:', error.message);
        throw new Error('Error downloading video: ' + error.message);
    }
};

// Function to upload video from a Buffer to Cloudinary
const uploadVideoToCloudinary = async (videoBuffer: Buffer): Promise<string> => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            { resource_type: 'video' },
            (error, result) => {
                if (error) {
                    console.error('Cloudinary upload error:', error);
                    reject(new Error('Failed to upload video to Cloudinary'));
                } else {
                    // Return only the secure URL (which is a string) from the result
                    resolve(result?.secure_url || ''); // If result or secure_url is not available, return an empty string
                }
            }
        );
        uploadStream.end(videoBuffer);
    });
};

// Function to verify if video exists on Cloudinary
const verifyVideoExists = async (publicId: string): Promise<boolean> => {
    try {
        const cleanPublicId = publicId.split('/').slice(1).join('/'); // Remove any version prefix if present
        const resource = await cloudinary.api.resource(cleanPublicId, { resource_type: 'video' });

        return !!resource; // Return true if the resource exists
    } catch (error) {
        console.error(`Error: Video with public ID "${publicId}" not found.`);
        return false;
    }
};

// Function to merge videos using Cloudinary transformations
export const mergeVideos = async (video1PublicId: string, video2PublicId: string) => {
    try {
        const video1Exists = await verifyVideoExists(video1PublicId);
        const video2Exists = await verifyVideoExists(video2PublicId);
        if (!video1Exists || !video2Exists) {
            throw new Error("One or both videos could not be found in Cloudinary.");
        }

        // Use Cloudinary's transformation to concatenate videos
        const response = await cloudinary.uploader.upload_large(
            `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/video/upload/${video1PublicId}`, {
            resource_type: 'video',
            type: 'upload',
            transformation: [
                { flags: 'splice', overlay: `video:${video2PublicId}` },
                { flags: 'layer_apply' },
            ],
        });

        return response.secure_url;
    } catch (error) {
        console.error("Error merging videos with Cloudinary:", error);
        throw new Error("Failed to merge videos");
    }
};

const deleteVideoFromCloudinary = async (publicId: string): Promise<string> => {
    try {
        const result = await cloudinary.uploader.destroy(publicId, { resource_type: 'video' });
        if (result.result === 'ok') {
            console.log(`Delete Video successfully ${publicId}`);
            return `Video with public ID ${publicId} has been deleted.`;
        } else {
            throw new Error(`Failed to delete video with public ID ${publicId}.`);
        }
    } catch (error: any) {
        console.error('Error deleting video from Cloudinary:', error.message);
        throw new Error('Error deleting video from Cloudinary: ' + error.message);
    }
};

// API route handler
export async function POST(req: NextRequest) {
    try {
        const { video1PublicId, video2PublicId } = await req.json();

        const video1Buffer = await downloadVideo(video1PublicId);
        const video2Buffer = await downloadVideo(video2PublicId);
        console.log('Video downloaded successfully');

        const uploadedVideo1 = await uploadVideoToCloudinary(video1Buffer);
        const uploadedVideo2 = await uploadVideoToCloudinary(video2Buffer);
        console.log('Video uploaded successfully');

        function extractAndCleanVideoId(cloudinaryUrl: string): string {
            // Extract the public_id from the Cloudinary URL
            const publicIdFromUrl = cloudinaryUrl.split('/upload/').length > 1
                ? cloudinaryUrl.split('/upload/')[1].split('.')[0]
                : null;

            // Check if publicIdFromUrl exists, otherwise return an empty string
            if (publicIdFromUrl) {
                // Clean the publicId by slicing and joining the segments after the first slash
                const cleanedVideoId = publicIdFromUrl.split('/').slice(1).join('/');
                return cleanedVideoId;
            }

            // Return an empty string if no valid public_id was found
            return '';
        }

        // Extract public IDs if URLs are provided
        const extractedVideo1Id = extractAndCleanVideoId(uploadedVideo1);
        const extractedVideo2Id = extractAndCleanVideoId(uploadedVideo2);
        console.log('Extract Video successfully');

        if (!extractedVideo1Id || !extractedVideo2Id) {
            return NextResponse.json({ error: 'Invalid video IDs provided' }, { status: 400 });
        }
        const mergedVideoUrl = await mergeVideos(extractedVideo1Id, extractedVideo2Id);
        console.log('Merge Video successfully');

        await deleteVideoFromCloudinary(extractedVideo1Id);
        await deleteVideoFromCloudinary(extractedVideo2Id);

        // Return video URLs after upload
        return NextResponse.json({
            mergedVideoUrl
        }, { status: 200 });

    } catch (error) {
        console.error('Error in video upload API handler:', error);
        return NextResponse.json({ error: 'Failed to upload videos' }, { status: 500 });
    }
}
```

`Frontend`
```bash
'use client';

import { useState } from 'react';

const MergeVideos = () => {
  // State to store the video public IDs and merged video URL
  const [videoPublicIds, setVideoPublicIds] = useState<string[]>(['', '']);
  const [mergedVideoUrl, setMergedVideoUrl] = useState<string>('');
  const [error, setError] = useState<string>('');

  // Function to handle the video merge operation
  const handleMergeVideos = async () => {
    // Check if both video public IDs are provided
    if (videoPublicIds.some(id => !id)) {
      setError('Please provide both video public IDs.');
      return;
    }

    try {
      // Sending the video public IDs to the API to merge them
      const response = await fetch('/api/mergeVideos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          video1PublicId: videoPublicIds[0],
          video2PublicId: videoPublicIds[1],
        }),
      });

      // Parsing the response from the API
      const data = await response.json();
      console.log("data:", data)
      // Check if the merge was successful
      if (response.ok) {
        setMergedVideoUrl(data.mergedVideoUrl);
        setError(''); // Clear error message if the merge is successful
      } else {
        setError(data.error || 'Failed to merge videos.');
      }
    } catch (error) {
      setError('An error occurred while merging videos.');
    }
  };

  return (
    <div>
      <h1>Merge Videos</h1>
      <div>
        {/* Input for the first video public ID */}
        <input
          type="text"
          placeholder="Enter video public ID 1"
          value={videoPublicIds[0]}
          onChange={(e) => setVideoPublicIds([e.target.value, videoPublicIds[1]])}
        />
      </div>
      <div>
        {/* Input for the second video public ID */}
        <input
          type="text"
          placeholder="Enter video public ID 2"
          value={videoPublicIds[1]}
          onChange={(e) => setVideoPublicIds([videoPublicIds[0], e.target.value])}
        />
      </div>
      <button onClick={handleMergeVideos}>Merge Videos</button>

      {/* Displaying error message */}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/* Displaying the merged video URL */}
      {mergedVideoUrl && (
        <p>
          Merged video URL:{' '}
          <a href={mergedVideoUrl} target="_blank" rel="noopener noreferrer">
            {mergedVideoUrl}
          </a>
        </p>
      )}
    </div>
  );
};

export default MergeVideos;
```
