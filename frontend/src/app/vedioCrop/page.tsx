'use client'
import React, { useState, useRef } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Slider from '@mui/material/Slider';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import { styled } from '@mui/material/styles';

const StyledVideo = styled('video')({
  maxWidth: '100%',
  height: 'auto',
  borderRadius: '8px',
});

const VideoCropPad = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState<string>('');
  const [processedVideo, setProcessedVideo] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [mode, setMode] = useState<'crop' | 'padding'>('crop');
  const videoRef = useRef<HTMLVideoElement>(null);

  // Dimensions state
  const [dimensions, setDimensions] = useState({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const previewUrl = URL.createObjectURL(file);
      setVideoPreview(previewUrl);
      setProcessedVideo('');
      setError('');

      // Reset dimensions when new video is selected
      const video = document.createElement('video');
      video.src = previewUrl;
      video.onloadedmetadata = () => {
        setDimensions({
          x: 0,
          y: 0,
          width: video.videoWidth,
          height: video.videoHeight,
        });
      };
    }
  };

  const handleModeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMode(event.target.value as 'crop' | 'padding');
  };

  const handleDimensionChange = (dimension: keyof typeof dimensions) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = Number(event.target.value);
    setDimensions(prev => ({
      ...prev,
      [dimension]: value
    }));
  };

  const processVideo = async () => {
    if (!selectedFile) return;

    setLoading(true);
    setError('');

    const formData = new FormData();
    formData.append('video', selectedFile);
    formData.append('type', mode);
    formData.append('x', dimensions.x.toString());
    formData.append('y', dimensions.y.toString());
    formData.append('width', dimensions.width.toString());
    formData.append('height', dimensions.height.toString());

    try {
      const response = await fetch('http://localhost:5000/process-video', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message);
      }

      setProcessedVideo(data.videoUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 800, margin: '0 auto', padding: 3 }}>
      <Card>
        <CardHeader 
          title="Video Crop & Padding Tool" 
          subheader="Upload a video to crop or add padding"
        />
        <CardContent>
          <Box sx={{ mb: 3 }}>
            <input
              type="file"
              accept="video/*"
              onChange={handleFileSelect}
              style={{ display: 'none' }}
              id="video-upload"
            />
            <label htmlFor="video-upload">
              <Button
                variant="contained"
                component="span"
                color="primary"
                fullWidth
              >
                Choose Video
              </Button>
            </label>
          </Box>

          {videoPreview && (
            <>
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Original Video
                </Typography>
                <StyledVideo
                  ref={videoRef}
                  src={videoPreview}
                  controls
                />
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Adjustment Mode
                </Typography>
                <RadioGroup
                  row
                  value={mode}
                  onChange={handleModeChange}
                >
                  <FormControlLabel
                    value="crop"
                    control={<Radio />}
                    label="Crop"
                  />
                  <FormControlLabel
                    value="padding"
                    control={<Radio />}
                    label="Padding"
                  />
                </RadioGroup>
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Dimensions
                </Typography>
                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                  <TextField
                    label="X Position"
                    type="number"
                    value={dimensions.x}
                    onChange={handleDimensionChange('x')}
                  />
                  <TextField
                    label="Y Position"
                    type="number"
                    value={dimensions.y}
                    onChange={handleDimensionChange('y')}
                  />
                  <TextField
                    label="Width"
                    type="number"
                    value={dimensions.width}
                    onChange={handleDimensionChange('width')}
                  />
                  <TextField
                    label="Height"
                    type="number"
                    value={dimensions.height}
                    onChange={handleDimensionChange('height')}
                  />
                </Box>
              </Box>

              <Box sx={{ mb: 3 }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={processVideo}
                  disabled={loading}
                  fullWidth
                >
                  {loading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    'Process Video'
                  )}
                </Button>
              </Box>
            </>
          )}

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {processedVideo && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Processed Video
              </Typography>
              <StyledVideo
                src={processedVideo}
                controls
              />
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default VideoCropPad;