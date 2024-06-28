// models/User.js
import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String, // if using email/password authentication
  // other fields as necessary
});

export default mongoose.models.User || mongoose.model('User', UserSchema);

// models/Project.js
const ProjectSchema = new mongoose.Schema({
  title: String,
  description: String,
  technologies: [String],
  link: String,
  userId: mongoose.Schema.Types.ObjectId,
});

export default mongoose.models.Project || mongoose.model('Project', ProjectSchema);

// models/Blog.js
const BlogSchema = new mongoose.Schema({
  title: String,
  content: String,
  date: { type: Date, default: Date.now },
  userId: mongoose.Schema.Types.ObjectId,
});

export default mongoose.models.Blog || mongoose.model('Blog', BlogSchema);

// models/Education.js
const EducationSchema = new mongoose.Schema({
  school: String,
  degree: String,
  fieldOfStudy: String,
  startDate: Date,
  endDate: Date,
  userId: mongoose.Schema.Types.ObjectId,
});

export default mongoose.models.Education || mongoose.model('Education', EducationSchema);

// pages/api/projects/[id].js
import dbConnect from '../../../utils/dbConnect';
import Project from '../../../models/Project';

export default async (req, res) => {
  const { method } = req;
  await dbConnect();

  switch (method) {
    case 'GET':
      try {
        const projects = await Project.find({ userId: req.query.id });
        res.status(200).json({ success: true, data: projects });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    case 'POST':
      try {
        const project = await Project.create(req.body);
        res.status(201).json({ success: true, data: project });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    // Add PUT and DELETE methods as necessary
    default:
      res.status(400).json({ success: false });
      break;
  }
};

// pages/index.js
import { useSession } from 'next-auth/client';

export default function Home() {
  const [session, loading] = useSession();

  if (loading) return <p>Loading...</p>;
  if (!session) return <p>You need to sign in to view this page</p>;

  return (
    <div>
      <h1>Welcome, {session.user.name}</h1>
      <p>This is your dashboard.</p>
      {/* Links to manage projects, blogs, education */}
    </div>
  );
}

// components/ProjectForm.js
import { useState } from 'react';

export default function ProjectForm({ onSubmit }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [technologies, setTechnologies] = useState('');
  const [link, setLink] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ title, description, technologies: technologies.split(','), link });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Project Title"
      />
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Project Description"
      />
      <input
        type="text"
        value={technologies}
        onChange={(e) => setTechnologies(e.target.value)}
        placeholder="Technologies (comma-separated)"
      />
      <input
        type="text"
        value={link}
        onChange={(e) => setLink(e.target.value)}
        placeholder="Project Link"
      />
      <button type="submit">Save Project</button>
    </form>
  );
}