import { Request, Response } from 'express';
import { buildResponse } from '../utils/helper';
import Project from '../models/Project.schema';




// Create A New Project //
const createProject = async (req: Request, res: Response) => {
    const { name, description, icon } = req.body;

    // checks that field is complete 
    if (!name || !description) {
        const response = buildResponse(
            false, 'Please provide all the required fields', null, 'One of the fields (or more) is missing', null);
        res.status(400).json(response);
        return;
    }

    try {
        // checks if the project exists
        const existingProject = await Project.findOne({ name });
        
        if (existingProject) {
            const response = buildResponse(false, 'Project already exists', null, null, null);
            res.status(409).json(response);
            return;
        }

        // Create a new project
        let newProject = new Project({ name, description, icon });
        await newProject.save();

        const response = buildResponse(true, 'New project successfully created', null, null, newProject)
        res.status(201).json(response);

    } catch (err) {
        const response = buildResponse(
            false, 'Error creating project', null, err instanceof Error ? err.message : 'Unknown error', null
        );
        res.status(500).json(response);
    }
};


const updateProject = async (req: Request, res: Response) => {
    const { name, description, icon, _id } = req.body;
    if(!name || !description){
        const response = buildResponse(false, 'Please provide all the required fields', null, 'One of the fields (or more) is missing', null);
        res.status(400).json(response);
        return;
    }
   try{
    const project = await Project.findOne({_id});
    if(!project){
        const response = buildResponse(false, 'Project not found', null, null, null);
        res.status(404).json(response);
        return;
    }
    project.name = name;
    project.description = description;
    if(icon){
        project.icon = icon;
    };
    await project.save();
    const response = buildResponse(true, 'Project updated successfully', null, null, project);
    res.status(200).json(response);
   }catch(error){
    const response = buildResponse(false, 'Failed to update project', null, null, null);
    res.status(500).json(response);
   }
};

const getAllProjects = async(req: Request, res: Response)=>{
    try{
        const projects = await Project.find();
        if(projects.length === 0){
            const response = buildResponse(false, 'No projects found', null, null, null);
            res.status(400).json(response);
            return;
        }
        const response = buildResponse(true, 'Projects found successfully', null, null, projects);
        res.status(200).json(response);
    }catch(error){
        const response = buildResponse(false, 'Failed to get projects', null, error instanceof Error? error.message : 'Unknown error', null);
        res.status(500).json(response);
    }
    

};

const deleteProject = async (req: Request, res: Response) => {
    const { projectId } = req.body;
    
    try {
        if (!projectId) {
          const response = buildResponse(
            false, 'No ID for delete', null, 'No matching parameter was received', null
          );
    
          res.status(400).json(response);
          return;
        }
        const deletedProject = await Project.findByIdAndDelete( projectId );
        
        if (!deletedProject) {
          const response = buildResponse(false, 'Project not found', null, null, null);
          res.status(404).json(response)
          return;
        }
        const response = buildResponse(true, 'Project deleted successfully', null, null, null);
        res.status(200).json(response)
        return;
      } catch (error) {
        const response = buildResponse(true, 'Error in delete project', null, null, null);
        res.status(500).json(response);
      }
}


export { createProject, updateProject, getAllProjects, deleteProject };
