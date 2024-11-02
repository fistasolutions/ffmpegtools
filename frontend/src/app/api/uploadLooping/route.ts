import type { NextApiRequest, NextApiResponse } from 'next';
import formidable from 'formidable';
import fs from 'fs';
import axios from 'axios';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const form = formidable();

  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to parse file' });
    }

    const videoFile = files.video as formidable.File;

    const formData = new FormData();
    formData.append('video', fs.createReadStream(videoFile.filepath));
    formData.append('loopCount', fields.loopCount as string);

    try {
      const response = await axios.post('http://localhost:5000/upload', formData, {
        headers: formData.getHeaders(),
      });

      res.status(200).json(response.data);
    } catch (error) {
      res.status(500).json({ error: 'Failed to upload video' });
    }
  });
}
