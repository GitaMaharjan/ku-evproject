import formidable from "formidable";
import fs from "fs";
import FormData from "form-data";

export const config = {
  api: {
    bodyParser: false, // Disable Next.js's default body parser
  },
};

export default async function handler(req, res) {
  if (req.method === "POST") {
    const form = new formidable.IncomingForm();

    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.error("Error parsing the form:", err);
        return res.status(500).json({ error: "Error parsing the form" });
      }

      console.log("Files received:", files); // Debugging output

      const file = files.file;
      if (!file) {
        console.error("No file uploaded.");
        return res.status(400).json({ error: "No file uploaded" });
      }

      const formData = new FormData();
      formData.append(
        "file",
        fs.createReadStream(file.filepath),
        file.originalFilename
      );

      try {
        console.log("Sending file to Flask backend..."); // Debugging output

        const response = await fetch("http://localhost:5000/api/predict", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.error("Flask backend returned error:", errorData);
          return res
            .status(response.status)
            .json({ error: errorData.error || "Prediction failed" });
        }

        const data = await response.json();
        return res.status(200).json(data);
      } catch (error) {
        console.error("Error communicating with the backend:", error);
        return res
          .status(500)
          .json({ error: "Error communicating with the backend" });
      }
    });
  } else {
    return res.status(405).json({ error: "Method not allowed" });
  }
}
