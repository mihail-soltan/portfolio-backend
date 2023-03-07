import mongoose from 'mongoose';

const ProjectSchema = new mongoose.Schema(
    {
        title: {required: true, type: String},
        overview: {required: true, type: String},
        tags: [{type: String}],
        source: {required: true, type: String},
        stack: [{type: String}],
        background: {type: String},
        github: {type: Object},
        pictures: [{type: String}],
    }
)


const Project  = mongoose.model('project', ProjectSchema);
export default Project;