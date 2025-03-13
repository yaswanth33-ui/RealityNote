# RealityNote - Modern Thought & Task Management

RealityNote is a comprehensive web application that combines note-taking, task management, and focus tools to help you stay organized and productive.

## Features

### 📝 Notes

- Rich text editor for creating and organizing notes
- Categories and tags for better organization
- Real-time saving and syncing
- Support for markdown formatting
- File attachments and image embedding

### ✅ Tasks

- Create and manage tasks with priorities
- Set due dates and reminders
- Task categories and labels
- Progress tracking
- Recurring tasks support
- Drag-and-drop task organization

### 🎯 Focus Mode

- Pomodoro timer
- Focus session tracking
- Distraction blocking
- Session statistics
- Custom work/break intervals

### 👤 User Profile

- Customizable user settings
- Dark/Light theme support
- Progress analytics
- Activity history
- Data export options

## Technology Stack

- **Frontend**: React 18, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **State Management**: React Query
- **Backend**: Supabase
- **Build Tool**: Vite
- **Router**: React Router v6
- **Authentication**: Supabase Auth

## Getting Started

### Prerequisites

- Node.js 18 or higher
- npm or yarn package manager
- Git

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yaswanth33-ui/RealityNote.git
cd RealityNote
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the root directory and add your Supabase credentials:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:8080`

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Project Structure

```
reality-note/
├── src/
│   ├── components/     # Reusable UI components
│   ├── pages/         # Page components
│   ├── lib/           # Utilities and configurations
│   ├── hooks/         # Custom React hooks
│   ├── types/         # TypeScript type definitions
│   └── styles/        # Global styles and theme
├── public/            # Static assets
└── tests/             # Test files
```

## Configuration

### Environment Variables

- `VITE_SUPABASE_URL`: Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY`: Your Supabase anonymous key

### Customization

- Theme customization in `src/index.css`
- Component styling using Tailwind classes
- Layout modifications in `src/components/layout`

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, please open an issue in the GitHub repository or contact the development team.

## Acknowledgments

- [Vite](https://vitejs.dev/)
- [React](https://reactjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Supabase](https://supabase.com/)

## Deployment

The application can be deployed to various platforms:

### Vercel

```bash
npm run build
vercel deploy
```

### Netlify

```bash
npm run build
netlify deploy
```

### Docker

```bash
docker build -t reality-note .
docker run -p 8080:80 reality-note
```

## Security

- Authentication handled by Supabase
- Data encryption in transit and at rest
- Regular security updates
- Input validation and sanitization

## Online Site
- https://yaswanth33-ui.github.io/RealityNote

## License 
- This project is licensed under the Apache License Version 2.0. See the LICENSE file for more details.

Contact For any inquiries or support, please reach out at yaswanthreddypanem@gmail.com .