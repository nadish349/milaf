# Milaf Cola Website

A modern, responsive website showcasing the Milaf Cola brand with smooth animations and interactive elements.

## 🚀 Live Demo

Visit the live website: [https://milaf.ae.vercel.app](https://milaf.ae.vercel.app)

## ✨ Features

- **Animated Hero Section**: Smooth transition from PAGE1.PNG to PAGE3.PNG
- **Static Header**: Professional header panel with 30% opacity
- **Multiple Pages**: PAGE5.PNG and PAGE6.PNG background sections
- **Milaf Cola Brand Pages**: 3 dedicated pages showcasing the brand
- **Responsive Design**: Works perfectly on all devices
- **Modern UI**: Built with React, TypeScript, and Tailwind CSS

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn/ui
- **Build Tool**: Vite
- **Deployment**: Vercel

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <your-repository-url>
   cd milaf
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:8080`

## 🚀 Deployment to Vercel

### Automatic Deployment (Recommended)

1. **Connect to Vercel**
   - Push your code to GitHub
   - Go to [vercel.com](https://vercel.com) and sign in
   - Click "New Project" and import your GitHub repository

2. **Configure Domain**
   - Set your custom domain to `milaf.ae.vercel.app`
   - Vercel will automatically handle SSL certificates

3. **Automatic Deployments**
   - Every push to your main branch will trigger a new deployment
   - Vercel provides preview deployments for pull requests

### Manual Deployment

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Deploy**
   ```bash
   vercel
   ```

3. **Follow the prompts** to configure your project

## 📁 Project Structure

```
milaf/
├── src/
│   ├── components/
│   │   ├── Hero.tsx              # Animated hero section
│   │   ├── Header.tsx            # Static header
│   │   ├── Page5Section.tsx      # PAGE5.PNG background
│   │   ├── Page6Section.tsx      # PAGE6.PNG background
│   │   ├── MilafColaPage1.tsx    # Brand introduction
│   │   ├── MilafColaPage2.tsx    # Features & benefits
│   │   ├── MilafColaPage3.tsx    # Call-to-action
│   │   └── Footer.tsx            # Footer section
│   ├── assets/
│   │   ├── PAGE1.png
│   │   ├── PAGE3.png
│   │   ├── PAGE5.png
│   │   ├── PAGE6.png
│   │   └── milafcola.png
│   └── pages/
│       └── Index.tsx             # Main page layout

└── package.json
```

## 🎨 Customization

### Changing Images
Replace the PNG files in `src/assets/` with your own images:
- `PAGE1.png` - Initial hero background
- `PAGE3.png` - Final hero background
- `PAGE5.png` - Fifth section background
- `PAGE6.png` - Sixth section background
- `milafcola.png` - Milaf Cola can image

### Updating Content
Edit the text content in the respective component files:
- `MilafColaPage1.tsx` - Brand introduction
- `MilafColaPage2.tsx` - Features and statistics
- `MilafColaPage3.tsx` - Contact information

### Styling
The project uses Tailwind CSS. You can customize colors, spacing, and other styles by modifying the className attributes in the component files.

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `vercel` - Deploy to Vercel

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 📞 Support

For support, email support@milafcola.com or create an issue in this repository.
