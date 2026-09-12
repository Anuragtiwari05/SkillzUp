import type { RoadmapData } from "./types";

const python: RoadmapData = {
  slug: "python",
  title: "Python",
  description: "From syntax basics to writing real applications, scripts, and APIs in Python.",
  group: "skill",
  icon: "Code2",
  nodes: [
    {
      id: "setup",
      title: "Setup & Tooling",
      description: "Getting a working Python environment.",
      category: "core",
      children: [
        { id: "install", title: "Installing Python & pip", description: "Getting Python running on your machine.", category: "core" },
        { id: "venv", title: "Virtual Environments", description: "Isolating dependencies per project.", category: "core" },
      ],
    },
    {
      id: "syntax",
      title: "Core Syntax",
      description: "The building blocks of the language.",
      category: "core",
      children: [
        { id: "vars-types", title: "Variables & Data Types", description: "Numbers, strings, booleans, None.", category: "core" },
        { id: "collections", title: "Lists, Tuples, Dicts, Sets", description: "Python's built-in collection types.", category: "core" },
        { id: "control-flow", title: "Control Flow", description: "if/else, loops, comprehensions.", category: "core" },
        { id: "functions", title: "Functions", description: "Defining reusable logic, args/kwargs.", category: "core" },
      ],
    },
    {
      id: "oop",
      title: "Object-Oriented Python",
      description: "Structuring larger programs with classes.",
      category: "core",
      children: [
        { id: "classes", title: "Classes & Objects", description: "Defining and using your own types.", category: "core" },
        { id: "inheritance", title: "Inheritance & Composition", description: "Sharing and reusing behavior.", category: "optional" },
      ],
    },
    {
      id: "error-handling",
      title: "Error Handling",
      description: "Dealing with things going wrong gracefully.",
      category: "core",
      children: [
        { id: "exceptions", title: "try/except/finally", description: "Catching and handling exceptions.", category: "core" },
      ],
    },
    {
      id: "std-lib",
      title: "Standard Library Essentials",
      description: "The tools that ship with Python itself.",
      category: "core",
      children: [
        { id: "file-io", title: "File I/O", description: "Reading and writing files.", category: "core" },
        { id: "json-csv", title: "json & csv modules", description: "Working with common data formats.", category: "core" },
        { id: "datetime", title: "datetime & pathlib", description: "Dates, times, and file paths.", category: "optional" },
      ],
    },
    {
      id: "packages",
      title: "Package Management",
      description: "Using code other people wrote.",
      category: "core",
      children: [
        { id: "pip-packages", title: "pip & PyPI", description: "Installing third-party packages.", category: "core" },
        { id: "requirements", title: "requirements.txt / pyproject.toml", description: "Declaring your project's dependencies.", category: "core" },
      ],
    },
    {
      id: "testing",
      title: "Testing",
      description: "Verifying your code does what you think it does.",
      category: "optional",
      children: [
        { id: "pytest", title: "pytest Basics", description: "Writing and running tests.", category: "optional", resources: [{ title: "pytest docs: Getting Started", url: "https://docs.pytest.org/en/stable/getting-started.html" }] },
      ],
    },
    {
      id: "web-data",
      title: "Pick a Direction",
      description: "Python branches heavily depending on what you're building.",
      category: "core",
      children: [
        { id: "web-frameworks", title: "Web: Flask / FastAPI / Django", description: "Building web APIs and apps.", category: "optional" },
        { id: "data-science", title: "Data: NumPy / pandas", description: "Data analysis and manipulation.", category: "optional" },
        { id: "automation", title: "Automation & Scripting", description: "Using Python for everyday task automation.", category: "optional" },
      ],
    },
    {
      id: "async-python",
      title: "Async Python",
      description: "Handling concurrent work efficiently.",
      category: "optional",
      children: [
        { id: "asyncio", title: "asyncio Basics", description: "async/await in Python.", category: "optional" },
      ],
    },
  ],
};

export default python;
