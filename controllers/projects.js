import Project from '../models/project.js'

export async function getProjects(request, response){
    try {
        const result = await Project.find()
        response.json(result)
    } catch(err) {
        response.status(500).json({message: error.message})
    }
}

export async function createProject(request, response) {
    try {
        const newProject = await Project.create(request.body);
        response.json(newProject)
    } catch(error) {
        response.status(400).json({ message: error.message})
    }
}