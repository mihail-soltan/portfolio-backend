import AWS from 'aws-sdk';
import Project from '../models/project.js';

const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
})

export async function getProjects(request, response) {
    try {
        const result = await Project.find()
        response.json(result)
    } catch (err) {
        response.status(500).json({ message: err.message })
    }
}


export async function getProjectById(request, response) {
    try {
        const result = await Project.findById(request.params.id)
        response.json(result)
    }
    catch (err) {
        response.status(500).json({ message: err.message })
    }
}

export async function createProject(request, response) {
    console.log(request.body)
    // Get the project data from the request body
    if (!request.files || request.files.length !== 3) {
        // Handle error when the file was not uploaded correctly
        return response.status(400).send({ message: 'File not uploaded correctly' });
    }

    const { title, overview, tags, source, stack, background, github } = request.body;

    const reqFiles = Array.from(request.files);

    // Set up the S3 upload parameters
    const s3Params = {
        Bucket: process.env.S3_BUCKET_NAME,
        ACL: 'bucket-owner-full-control', // Make the object publicly readable
    };
    try {
        const newProject = new Project({
            title,
            overview,
            tags,
            source,
            stack,
            background,
            github,
            pictures: [],
        });

        // for of loop allows us to use the await keyword to wait for each 
        // upload to complete before moving on to the next one. 
        for (const file of reqFiles) {
            s3Params.Key = file.originalname;
            s3Params.Body = file.buffer;
            s3Params.ContentType = file.mimetype;

            // Upload the image to S3
            const s3Data = await s3.upload(s3Params).promise();
            console.log('Image uploaded to S3:', s3Data.Location);

            // Save the new project to the database
            newProject.pictures.push(s3Data.Location);
        }
        const savedProject = await newProject.save();
        console.log('New project saved:', savedProject);
        response.status(201).json({ message: 'Project created successfully' });
    } catch (error) {
        console.error('Error creating project:', error);
        response.status(500).json({ error: error.message });
    }
}