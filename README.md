# Modern Soundboard with Timer

A modern, responsive web-based soundboard application with timer functionality, built using vanilla JavaScript and modern web technologies.

![Version](https://img.shields.io/badge/version-0.0.3-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

## Features

- 🎵 Sound playback with visualization
- ⏲️ Configurable timer with controls
- 🌓 Dark/Light theme with system preference detection
- 📱 Responsive design for all devices
- ⌨️ Keyboard shortcuts
- 🎚️ Volume control
- 📤 Drag and drop file upload
- 🔔 Toast notifications
- ♿ Accessibility features
- 📱 PWA support
- 🌐 GitHub Pages integration
- 💾 Offline functionality
- 🎨 Modern UI/UX design
- 🔄 Virtual environment support

## Getting Started

### Prerequisites

- Python 3.9 or higher
- Modern web browser (Chrome, Firefox, Safari, Edge)
- pip (Python package installer)
- Virtual environment (recommended)

### Installation

1. Clone the repository:
   ```shell
   git clone https://github.com/yourusername/Soundboard-Python.git
   ```

2. Navigate to the project directory:
   ```shell
   cd Soundboard-Python
   ```

3. Create and activate a virtual environment:
   ```shell
   python3 -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

4. Install required packages:
   ```shell
   pip install -r requirements.txt
   ```

5. Generate placeholder sounds (optional):
   ```shell
   python src/python/create_sounds.py
   ```

6. Open `docs/index.html` in your web browser or serve it through a local web server.

## Usage

### Basic Controls

- Click sound buttons to play sounds
- Use the timer controls to manage countdown
- Adjust volume using the slider
- Toggle theme with the theme button
- Upload custom sounds via drag and drop or file picker

### Keyboard Shortcuts

- `Space`: Play/Pause Timer
- `R`: Reset Timer
- `1-3`: Play Sounds 1-3
- `M`: Mute/Unmute

### Supported Audio Formats

- WAV (recommended for best compatibility)
- MP3
- OGG
- FLAC
- AIFF

Maximum file size: 10MB

## Development

### Project Structure

```plaintext
Soundboard-Python/
├── docs/                  # GitHub Pages files
│   ├── css/              # Stylesheets
│   ├── js/               # JavaScript files
│   ├── sounds/           # Sound files
│   ├── index.html        # Main application
│   ├── _config.yml       # GitHub Pages config
│   └── sw.js             # Service Worker
├── src/                  # Source code
│   └── python/           # Python scripts
│       ├── soundboard.py # Main Python app
│       └── create_sounds.py # Sound generator
├── sounds/               # Original sound files
├── venv/                 # Virtual environment
├── requirements.txt      # Python dependencies
├── README.md            # Documentation
├── CHANGELOG.md         # Version history
└── LICENSE             # License information
```

### Technologies Used

- HTML5 with semantic markup
- CSS3 with Custom Properties
- Vanilla JavaScript (ES6+)
- Web Audio API
- Service Workers for PWA
- Python 3.9+
- Font Awesome Icons
- GitHub Pages

### Development Setup

1. Install Python dependencies:
   ```shell
   pip install -r requirements.txt
   ```

2. Start local development:
   ```shell
   python -m http.server
   ```

3. Visit `http://localhost:8000/docs/` in your browser

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Font Awesome for icons
- [Keep a Changelog](https://keepachangelog.com)
- [Semantic Versioning](https://semver.org)
- Web Audio API community
- GitHub Pages
