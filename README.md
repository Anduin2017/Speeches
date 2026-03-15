# Speeches Framework

This repository is a unified framework for organizing, building, and presenting markdown-based slides using Pandoc and Reveal.js. It automatically aggregates multiple presentations into a single web portal and provides an easy-to-deploy Docker workflow.

## Project Structure

The structure is optimized for hosting multiple standalone presentations:

```text
.
├── Dockerfile          # Builds the static server image
├── .gitlab-ci.yml      # CI/CD pipeline for deploying to internal and public registries
├── build.js            # Node.js script to compile all speeches
├── speeches/           # The directory containing all presentations
│   ├── moog/           # Example presentation
│   │   ├── slides.md   # [Required] The actual slide contents
│   │   ├── checklist.md# [Optional] Personal preparation lists
│   │   └── background.jpeg # [Optional] Cover image for the web portal index
│   └── hello-world/    # Another presentation
└── ...
```

## How to Create a New Speech

1. Create a new subfolder in the `speeches/` directory. The folder name will serve as the URL endpoint.
2. Inside that folder, create a `slides.md` file. This acts as the source code for your slides.
3. (Optional) Put a `background.jpeg` in the folder. This will be automatically picked up by the build script to display as the cover card on the index page.
4. Add any static resources (like a `Pics/` folder) directly inside your speech's folder. 
5. Commit and push the changes for the CI runner to automatically build and deploy it!

## Running and Compiling Locally

Since the slides rely heavily on `pandoc` to compile the Reveal.js HTML files, ensure Pandoc is installed locally.

```bash
# Install node dependencies
npm install

# Compile all speeches to the 'dist' folder
npm run prod
```

You can then serve the `/dist` directory using any local web server (e.g. `npx serve dist`).

## Docker Deployment

This repository includes a multi-staged `Dockerfile` which natively handles building the frontend and serving it using the `hub.aiursoft.com/aiursoft/static` container.
The web server runs locally and securely on port `5000`.

```bash
# Build the docker container
docker build -t moogspeech .

# Run the docker container
docker run -p 5000:5000 moogspeech
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.