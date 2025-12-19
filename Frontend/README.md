# Playgorithm Frontend

## 🎮 Where Algorithms Turn into Games

A modern, interactive landing page for Playgorithm - the gamified algorithmic learning platform.

### ✨ Features

- **Modern Gaming Design**: Cyberpunk-inspired UI with neon colors and animations
- **Fully Responsive**: Optimized for all devices from mobile to desktop
- **Interactive Animations**: Smooth Framer Motion animations and hover effects
- **Accessibility First**: WCAG compliant with keyboard navigation and screen reader support
- **Performance Optimized**: Fast loading with optimized assets and animations

### 🛠️ Tech Stack

- **React 18** - Modern React with hooks
- **Vite** - Lightning fast build tool
- **Framer Motion** - Smooth animations and transitions
- **Bootstrap 5** - Responsive grid and components
- **React Icons** - Beautiful icon library
- **CSS3** - Custom gaming-themed styling

### 🚀 Getting Started

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Configure Environment Variables**
   
   Copy the `.env.example` file to `.env`:
   ```bash
   cp .env.example .env
   ```
   
   Update the environment variables in `.env`:
   ```
   VITE_API_BASE_URL=http://localhost:8080
   VITE_VISUALIZER_BASE_URL=http://localhost:3001
   ```
   
   - `VITE_API_BASE_URL`: Backend API server URL (default: http://localhost:8080)
   - `VITE_VISUALIZER_BASE_URL`: Algorithm Visualizer Next.js server URL (default: http://localhost:3001)

3. **Start Development Server**
   ```bash
   npm run dev
   ```

4. **Build for Production**
   ```bash
   npm run build
   ```

### 🎨 Design Features

- **Gaming Typography**: Orbitron and Rajdhani fonts for that futuristic feel
- **Neon Color Scheme**: Primary green (#00ff88) and secondary pink (#ff0080)
- **Animated Background**: Floating particles for immersive experience
- **Interactive Elements**: Hover effects, button animations, and smooth scrolling
- **Mobile Navigation**: Collapsible navbar with smooth transitions

### 📱 Responsive Breakpoints

- **Mobile**: < 576px
- **Tablet**: 576px - 768px
- **Desktop**: 768px - 1200px
- **Large Desktop**: > 1200px

### 🎯 Sections

1. **Hero Section**: Main landing with call-to-action
2. **Features Section**: Key platform features with icons
3. **Stats Section**: Platform statistics and achievements
4. **Battles Section**: Algorithm battle previews
5. **CTA Section**: Final call-to-action
6. **Footer**: Links and social media

### 🔧 Customization

The design system uses CSS custom properties for easy theming:

```css
:root {
  --primary-color: #00ff88;
  --secondary-color: #ff0080;
  --accent-color: #00d4ff;
  --dark-bg: #0a0a0a;
  --text-light: #ffffff;
}
```

### 📦 Project Structure

```
src/
├── components/
│   ├── AnimatedBackground.jsx
│   └── AnimatedBackground.css
├── App.jsx
├── App.css
├── main.jsx
└── index.css
```

### 🎮 Gaming Elements

- Sword icon branding
- Battle-themed language
- XP and achievement systems
- Difficulty badges (Easy, Medium, Hard)
- Neon glow effects
- Cyberpunk color palette

Built with ❤️ for the coding community