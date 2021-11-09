import mongoose from 'mongoose';

const ProjectSchema = new mongoose.Schema(
    {
        title: {required: true, type: String},
        source: {required: true, type: String},
        stack: {type: String},
        github: {type: Object},
        picture: {type: String}
    }
)


const Project  = mongoose.model('project', ProjectSchema);
export default Project;