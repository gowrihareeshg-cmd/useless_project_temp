# Biscuit Protector 🍪☕

## Basic Details

### Team Name: [Your Team Name]

### Team Members

- Team Lead: Gowri Hareesh - Baselios Mathews II College of Engineering
- Member 2: Farhana navas - Baselios Mathews II College of Engineering

### Project Description

Biscuit Protector is an unnecessarily advanced software solution for one of life's most serious non-existent problems: achieving the perfect biscuit dip in tea.

The application tracks dipping time, monitors Biscuit Integrity using a live percentage bar, gives real-time warnings, and generates a Dip Score™ based on how accurately the biscuit was dipped.

### The Problem (that doesn't exist)

Have you ever dipped a biscuit in tea and wondered:

"Is it soft enough yet... or is it about to fall into the tea?"

Too little dipping and the biscuit stays disappointingly dry.

Too much dipping and the biscuit may lose its structural integrity and become part of the tea.

Clearly, humanity needed a technological solution.

### The Solution (that nobody asked for)

Introducing Biscuit Protector™ — an advanced biscuit-dipping monitoring system that nobody asked for.

The user selects a biscuit type and presses START DIP when the biscuit enters the tea.

The application starts a live timer and displays a Biscuit Integrity percentage bar. As the dipping time increases, the system provides real-time warnings.

Finally, the user presses SAVE BISCUIT and receives a Dip Score™ based on how close their dipping time was to the selected benchmark.

Because apparently, dipping a biscuit needed engineering.

## Technical Details

### Technologies/Components Used

For Software:

- HTML
- CSS
- JavaScript
- Visual Studio Code
- Web Browser
- Android APK

For Hardware:

- No hardware components used
- The project is completely software-based

### Implementation

For Software:

The project consists of three main files:

- `index.html` - Contains the structure and user interface of the application.
- `style.css` - Controls the design, layout, buttons and Biscuit Integrity progress bar.
- `script.js` - Handles the timer, percentage calculation, warning system and Dip Score™ calculation.

The application uses JavaScript's real-time timer functionality to calculate the elapsed dipping time.

Different biscuit types have different demonstration benchmark times:

- Parle-G - 2.5 seconds
- Marie - 3 seconds
- Good Day - 3.5 seconds
- Hide & Seek - 3 seconds

The Biscuit Integrity percentage is calculated according to the elapsed time compared with the selected biscuit's benchmark.

The system provides four warning levels:

- 🟢 STILL SAFE
- 🟡 GETTING CLOSE
- 🟠 REMOVE SOON!
- 🔴 REMOVE BISCUIT NOW!!!

After the biscuit is saved, the system calculates a Dip Score™ based on the difference between the actual dipping time and the benchmark time.

> Note: The dipping times used in this project are demonstration benchmarks created for the hackathon and are not scientifically validated measurements.

# Installation

No external libraries or complicated installation is required.

### Steps:

1. Download or clone the project repository.
2. Open the project folder in Visual Studio Code.
3. Make sure the following files are present:

```text
BiscuitProtector/
│
├── index.html
├── style.css
└── script.js
Open the project in Visual Studio Code.
Run the index.html file in a web browser.
Run
Method 1: Browser

Open the following file:

index.html

in any modern web browser.

Method 2: Visual Studio Code
Open the BiscuitProtector folder in Visual Studio Code.
Open index.html.
Launch it using a browser or the VS Code integrated browser.
Select a biscuit.
Press START DIP.
Watch the timer and Biscuit Integrity percentage.
Press SAVE BISCUIT to get the final Dip Score™.
Android APK

The web application is also packaged as an Android APK for mobile demonstration.

Project Documentation

For Software:

Screenshots

Main Biscuit Protector interface showing biscuit selection, timer and START DIP button.

Live dipping screen showing the timer and real-time Biscuit Integrity percentage.

Final result screen displaying the dipping time, biscuit status and Dip Score™.

Diagrams

Workflow showing the complete Biscuit Protector process from biscuit selection to the final Dip Score™.

Project Workflow
             START
               │
               ▼
       Select Biscuit
               │
               ▼
           START DIP
               │
               ▼
         Start Timer
               │
               ▼
      Calculate Elapsed Time
               │
               ▼
       Update Integrity %
               │
               ▼
      Display Warning Status
               │
               ▼
        SAVE BISCUIT
               │
               ▼
      Calculate Dip Score™
               │
               ▼
          Show Result
               │
               ▼
              END
Biscuit Dip Logic
Select Biscuit
      │
      ▼
Get Benchmark Time
      │
      ▼
Start Timer
      │
      ▼
Calculate Percentage
      │
      ▼
Display Biscuit Integrity
      │
      ▼
Check Dip Status
      │
      ├── < 50% → STILL SAFE
      │
      ├── < 80% → GETTING CLOSE
      │
      ├── < 100% → REMOVE SOON
      │
      └── 100% → REMOVE BISCUIT NOW
      │
      ▼
Save Biscuit
      │
      ▼
Calculate Dip Score™
      │
      ▼
Display Final Result

For Hardware:

Schematic & Circuit

Not applicable.

This project does not use any hardware or electronic circuit.

Build Photos

Not applicable.

This project is completely software-based.

Project Demo
Video

[Add your demo video link here]

The video demonstrates the complete Biscuit Protector workflow, including biscuit selection, live dipping timer, Biscuit Integrity percentage, warning system and final Dip Score™.

Additional Demos
Android APK demonstration
Live biscuit dipping demonstration
Real-time Biscuit Integrity percentage demonstration
Dip Score™ calculation demonstration
Different biscuit benchmark demonstrations
Team Contributions
Gowri Hareesh: Project concept, problem identification, UI design, HTML/CSS development, JavaScript functionality, timer implementation, Biscuit Integrity system, Dip Score™ logic, testing and presentation.
Farhana navas : Project development support, testing, documentation, demo preparation and presentation.
