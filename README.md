# 🎬 Ratflix

A command-line interface for browsing and streaming movies and TV shows. Navigate through content using familiar terminal-style commands.

## Features
- Search for movies and TV shows
- Browse seasons and episodes
- Track watch history across shows
- Resume from last watched episodes
- Intuitive navigation system

## Commands
(may be outdated, run `help` for latest)

| Command           | Description                            |
|-------------------|----------------------------------------|
| `f <search term>` | Find movies and TV shows               |
| `cd <index>`      | Navigate to selected media             |
| `cd ..`           | Go back one level                      |
| `ls`              | List available content                 |
| `p`               | Play current media                     |
| `p <index>`       | Play specific episode                  |
| `n`               | Play next episode                      |
| `l`               | Resume last watched episode            |
| `ln`              | Play next episode of last watched show |
| `hs`              | Display watch history                  |
| `pr`              | Choose video providers                 |
| `cust`            | customization options                  |
| `clear`           | Clear console                          |
| `pwd`             | Show current path                      |
| `help`            | Display all commands                   |

# Command Examples

## Navigation

### Search for content
```bash
f stranger things
f inception
find Better call Saul
```

### Navigate using index or name

```bash
cd 1
cd Breaking Bad
cd Breaking Bad/2
```

### Go back to root
```bash
cd
cd ..
```

## Playing Content

### Play current media
```bash
p
```

### Play specific episode
```bash
p 5
p Money Heist
p Breaking Bad/2
p The Wire/3/7
```


### Continue watching
```bash
l
ln
n
```

# History & Information

### View watch history
```bash
hs
history 
```

### Check current location
```bash
pwd
```

### List available content
```bash
ls
```

# Command flow example

```bash
f breaking bad
cd 1
ls
cd 2
p 3
n
n
cd ..
ls

*next day

ln
n
n
```

# Themes

```bash
cust //view customization options

cust imp <jsontheme> // Import jsontheme
cust exp // Export current theme
```

### Default theme
(applied on 'cust r')

```bash
```ratflix theme
{
  "--path-color": "#868686",
  "--prompt-color": "#ffffff",
  "--command-color": "#e74856",
  "--args-color": "#cbcbcb",
  "--prompt-symbol": "/>",
  "--title-color": "#e74856",
  "--title-text": "ratflix",
  "--background-color": "#1e1e1e",
  "--output-color": "#fff",
  "--console-font": "\"Monaco\", monospace"
}
```

### Hackflix theme
```bash
```hackflix theme
{
  "--path-color": "#00ff00",
  "--prompt-color": "#00ff00",
  "--command-color": "#00ff00",
  "--args-color": "#00ff00",
  "--prompt-symbol": "#",
  "--title-color": "#00ff00",
  "--title-text": "hackflix",
  "--background-color": "#000000",
  "--output-color": "#11ff11",
  "--console-font": "\"Monaco\", monospace"
}
```

### VaporWave
```bash
```vaporwave theme
{
  "--path-color": "#ff77e9",
  "--prompt-color": "#77ffff",
  "--command-color": "#ffdc5e",
  "--args-color": "#ff77e9",
  "--prompt-symbol": ">>",
  "--title-color": "#ff77e9",
  "--title-text": "neovi",
  "--background-color": "#282a36",
  "--output-color": "#ffffff",
  "--console-font": "\"Monaco\", monospace"
}
```

### Cutie Patutie
```bash
```cutie theme
{
  "--path-color": "#f8b4d9",
  "--prompt-color": "#fadadd",
  "--command-color": "#a3d9ff",
  "--args-color": "#c7f9cc",
  "--prompt-symbol": "♥",
  "--title-color": "#f8b4d9",
  "--title-text": "pastelflix",
  "--background-color": "#fffafc",
  "--output-color": "#c9c9ff",
  "--console-font": "\"Monaco\", monospace"
}
```

### Cookie Theme
```bash
```cookie theme
{
  "--path-color": "#d4a373",
  "--prompt-color": "#f5c16c",
  "--command-color": "#8c4b24",
  "--args-color": "#d6b785",
  "--prompt-symbol": "🍪",
  "--title-color": "#f5c16c",
  "--title-text": "Cookie Crumbles",
  "--background-color": "#2c1d12",
  "--output-color": "#ffffff",
  "--console-font": "\"Monaco\", monospace"
}
```

### Gentleman theme
```bash
```gentleman theme
{
  "--path-color": "#6c757d",
  "--prompt-color": "#ffffff",
  "--command-color": "#343a40",
  "--args-color": "#adb5bd",
  "--prompt-symbol": "→",
  "--title-color": "#495057",
  "--title-text": "The Gentleman’s Cinema",
  "--background-color": "#1b1e21",
  "--output-color": "#f8f9fa",
  "--console-font": "\"Monaco\", monospace"
}
```


### Midnight Glow theme
```bash
```midnight-glow theme
{
  "--path-color": "#ff9d00",
  "--prompt-color": "#00d1ff",
  "--command-color": "#ffa7c4",
  "--args-color": "#9eff89",
  "--prompt-symbol": "⚡",
  "--title-color": "#ff4081",
  "--title-text": "Midnight Glowing screen",
  "--background-color": "#1a1a2e",
  "--output-color": "#ffffff",
  "--console-font": "\"Monaco\", monospace"
}
```

### Flash Grenate 
```bash
```flash-grenade theme
{
  "--path-color": "#cccccc",
  "--prompt-color": "#ffffff",
  "--command-color": "#eeeeee",
  "--args-color": "#dddddd",
  "--prompt-symbol": ">",
  "--title-color": "#ffffff",
  "--title-text": "Flash Grenadas",
  "--background-color": "#000000",
  "--output-color": "#ffffff",
  "--console-font": "\"Monaco\", monospace"
}
```

### Nature Theme
```bash
```nature theme
{
  "--path-color": "#6a9955",
  "--prompt-color": "#4ec9b0",
  "--command-color": "#d7ba7d",
  "--args-color": "#a8c97f",
  "--prompt-symbol": "🌲",
  "--title-color": "#4ec9b0",
  "--title-text": "Forest Stream",
  "--background-color": "#1e2e1f",
  "--output-color": "#d4d4d4",
  "--console-font": "\"Monaco\", monospace"
}
```

### Breaking Bad theme
```bash
### Breaking Streams  
```bash
```breaking-bad theme
{
  "--path-color": "#97c93c",
  "--prompt-color": "#ffffff",
  "--command-color": "#3a3a3a",
  "--args-color": "#6da34d",
  "--prompt-symbol": "Br>",
  "--title-color": "#97c93c",
  "--title-text": "Breaking Streams",
  "--background-color": "#1a1a1a",
  "--output-color": "#e0e0e0",
  "--console-font": "\"Monaco\", monospace"
}
```

### Cosmic
```bash
### Cosmic Binge  
```bash
```cosmic-binge theme
{
  "--path-color": "#ff6ac1",
  "--prompt-color": "#8be9fd",
  "--command-color": "#bd93f9",
  "--args-color": "#ffb86c",
  "--prompt-symbol": "✦",
  "--title-color": "#50fa7b",
  "--title-text": "Cosmic Binge",
  "--background-color": "#0d0221",
  "--output-color": "#f8f8f2",
  "--console-font": "\"Monaco\", monospace"
}
```

### Dark theme
```bash
### Shadow Streams  
```bash
```shadow-streams theme
{
  "--path-color": "#5a5a5a",
  "--prompt-color": "#aaaaaa",
  "--command-color": "#ffffff",
  "--args-color": "#787878",
  "--prompt-symbol": "$",
  "--title-color": "#ff5555",
  "--title-text": "Shadow Streams",
  "--background-color": "#121212",
  "--output-color": "#dcdcdc",
  "--console-font": "\"Monaco\", monospace"
}
```

### Cock
```bash
### Wild Streams  
```bash
```wild-streams theme
{
  "--path-color": "#f39c12",
  "--prompt-color": "#e74c3c",
  "--command-color": "#3498db",
  "--args-color": "#2ecc71",
  "--prompt-symbol": "8===D",
  "--title-color": "#f39c12",
  "--title-text": "Wild Streams",
  "--background-color": "#2c3e50",
  "--output-color": "#ecf0f1",
  "--console-font": "\"Monaco\", monospace"
}
```

### Papyrus

```bash
```ScrollStream theme
{
  "--path-color": "#5c4b33",
  "--prompt-color": "#5c4b33",
  "--command-color": "#8b5a2b",
  "--args-color": "#a0522d",
  "--prompt-symbol": ": ",
  "--title-color": "#5c4b33",
  "--title-text": "ScrollStream",
  "--background-color": "#ffe1ad",
  "--output-color": "#5c4b33",
  "--console-font": "\"Tangerine\", monospace"
}
```

### CssLess

```bash
```CssLess theme
{
  "--path-color": "#000000",
  "--prompt-color": "#000000",
  "--command-color": "#000000",
  "--args-color": "#000000",
  "--prompt-symbol": " ",
  "--title-color": "#000000",
  "--title-text": "Virus.exe",
  "--background-color": "#ffffff",
  "--output-color": "#000000",
   "--console-font": "\"Times New Roman\", monospace"
}
```

### Jetbrains
```bash
### JetBrains Stream  
```bash
```BretJains theme
{
  "--path-color": "#6a9fb5",
  "--prompt-color": "#ffffff",
  "--command-color": "#cc7832",
  "--args-color": "#ffc66d",
  "--prompt-symbol": ">",
  "--title-color": "#6897bb",
  "--title-text": "BretJains",
  "--background-color": "#2b2b2b",
  "--output-color": "#f1d8de",
  "--console-font": "\"JetBrains Mono\", monospace"
}
```

### Funny theme that everyone should look down on :)
```bash
```summoners-stream theme
{
  "--path-color": "#00c5e7",
  "--prompt-color": "#ffd700",
  "--command-color": "#c24e2e",
  "--args-color": "#b0b0b0",
  "--prompt-symbol": ">",
  "--title-color": "#6a4e00",
  "--title-text": "Summoner's Stream",
  "--background-color": "#1c1c1c",
  "--output-color": "#e0e0e0",
  "--console-font": "\"Monaco\", monospace"
}
```

### Harmony
```bash
```Vibrant-Contrast theme (not really)
{
  "--path-color": "#f44336",
  "--prompt-color": "#ffffff",
  "--command-color": "#ff9800",
  "--args-color": "#2196f3",
  "--prompt-symbol": "⚡",
  "--title-color": "#ff9800",
  "--title-text": "Vibrant Contrast",
  "--background-color": "#212121",
  "--output-color": "#e0e0e0",
  "--console-font": "\"Monaco\", monospace"
}
```

### SolarFlare
```bash
{
  "--path-color": "#ffcb6b",
  "--prompt-color": "#ffffff",
  "--command-color": "#c3e88d",
  "--args-color": "#89ddff",
  "--prompt-symbol": ">",
  "--title-color": "#ff5370",
  "--title-text": "SolarFlare",
  "--background-color": "#1e1e2e",
  "--output-color": "#d0d0d0",
  "--console-font": "\"Monaco\", monospace"
}
```

## Even more Themes:

Oceanic Breeze Theme

{
"--path-color": "#61afef",
"--prompt-color": "#abb2bf",
"--command-color": "#e5c07b",
"--args-color": "#98c379",
"--prompt-symbol": "➜",
"--title-color": "#56b6c2",
"--title-text": "Oceanic Breeze",
"--background-color": "#282c34",
"--output-color": "#dcdfe4",
"--console-font": "\"Monaco\", monospace"
}

Midnight Forest Theme

{
"--path-color": "#a3be8c",
"--prompt-color": "#eceff4",
"--command-color": "#81a1c1",
"--args-color": "#ebcb8b",
"--prompt-symbol": "▶",
"--title-color": "#88c0d0",
"--title-text": "Midnight Forest",
"--background-color": "#2e3440",
"--output-color": "#d8dee9",
"--console-font": "\"Monaco\", monospace"
}

Desert Sunset Theme

{
"--path-color": "#d08770",
"--prompt-color": "#e5e9f0",
"--command-color": "#bf616a",
"--args-color": "#ebcb8b",
"--prompt-symbol": "$",
"--title-color": "#eb606b",
"--title-text": "Desert Sunset",
"--background-color": "#3b4252",
"--output-color": "#eceff4",
"--console-font": "\"Monaco\", monospace"
}

Cyberpunk Glow Theme

{
"--path-color": "#ff79c6",
"--prompt-color": "#8be9fd",
"--command-color": "#bd93f9",
"--args-color": "#f1fa8c",
"--prompt-symbol": "⚡",
"--title-color": "#ff5555",
"--title-text": "Cyberpunk Glow",
"--background-color": "#282a36",
"--output-color": "#f8f8f2",
"--console-font": "\"Monaco\", monospace"
}

Vintage Terminal Theme

{
"--path-color": "#af875f",
"--prompt-color": "#d7d7af",
"--command-color": "#5fafd7",
"--args-color": "#afaf87",
"--prompt-symbol": "$",
"--title-color": "#d75f5f",
"--title-text": "Vintage Terminal",
"--background-color": "#1c1c1c",
"--output-color": "#d0d0d0",
"--console-font": "\"Monaco\", monospace"
}

Aurora Frost Theme

{
"--path-color": "#88c0d0",
"--prompt-color": "#d8dee9",
"--command-color": "#81a1c1",
"--args-color": "#a3be8c",
"--prompt-symbol": "❄",
"--title-color": "#5e81ac",
"--title-text": "Aurora Frost",
"--background-color": "#2e3440",
"--output-color": "#e5e9f0",
"--console-font": "\"Monaco\", monospace"
}

Stranger Things Theme

{
"--path-color": "#e50000",
"--prompt-color": "#f8f8f2",
"--command-color": "#d65d0e",
"--args-color": "#ffb86c",
"--prompt-symbol": "❖",
"--title-color": "#ff0000",
"--title-text": "Stranger Things",
"--background-color": "#0a0a0a",
"--output-color": "#c5c5c5",
"--console-font": "\"Monaco\", monospace"
}

The Matrix Theme

{
"--path-color": "#00ff41",
"--prompt-color": "#c5c8c6",
"--command-color": "#00cc33",
"--args-color": "#99ff99",
"--prompt-symbol": "▮",
"--title-color": "#00ff41",
"--title-text": "The Matrix",
"--background-color": "#000000",
"--output-color": "#c5c8c6",
"--console-font": "\"Monaco\", monospace"
}

Game of Thrones Theme

{
"--path-color": "#2b85c2",
"--prompt-color": "#ffffff",
"--command-color": "#dcbfa0",
"--args-color": "#6a9f5b",
"--prompt-symbol": "🐺",
"--title-color": "#a9a9a9",
"--title-text": "Game of Thrones",
"--background-color": "#0c0d0e",
"--output-color": "#e0e0e0",
"--console-font": "\"Monaco\", monospace"
}

Star Wars Theme

{
"--path-color": "#ffd700",
"--prompt-color": "#ffffff",
"--command-color": "#ffa500",
"--args-color": "#87ceeb",
"--prompt-symbol": "✦",
"--title-color": "#ffcc00",
"--title-text": "Star Wars",
"--background-color": "#000000",
"--output-color": "#eeeeee",
"--console-font": "\"Monaco\", monospace"
}

Breaking Bad Theme

{
"--path-color": "#4caf50",
"--prompt-color": "#e8f5e9",
"--command-color": "#388e3c",
"--args-color": "#c8e6c9",
"--prompt-symbol": "☣",
"--title-color": "#81c784",
"--title-text": "Breaking Bad",
"--background-color": "#1b1b1b",
"--output-color": "#dce775",
"--console-font": "\"Monaco\", monospace"
}

Harry Potter Theme

{
"--path-color": "#ffcc00",
"--prompt-color": "#ffffff",
"--command-color": "#b52a00",
"--args-color": "#8f52cc",
"--prompt-symbol": "⚡",
"--title-color": "#6a4b4b",
"--title-text": "Harry Potter",
"--background-color": "#2d2d2d",
"--output-color": "#cccccc",
"--console-font": "\"Monaco\", monospace"
}

Marvel Avengers Theme

{
"--path-color": "#d32f2f",
"--prompt-color": "#ffffff",
"--command-color": "#1976d2",
"--args-color": "#fbc02d",
"--prompt-symbol": "⍟",
"--title-color": "#ff0000",
"--title-text": "Marvel Avengers",
"--background-color": "#212121",
"--output-color": "#b0bec5",
"--console-font": "\"Monaco\", monospace"
}

Cyberpunk 2077 Theme

{
"--path-color": "#ffcd00",
"--prompt-color": "#fdfdfd",
"--command-color": "#ff5733",
"--args-color": "#00ffff",
"--prompt-symbol": "↯",
"--title-color": "#ffcd00",
"--title-text": "Cyberpunk 2077",
"--background-color": "#1e1e1e",
"--output-color": "#c7c7c7",
"--console-font": "\"Monaco\", monospace"
}

Lord of the Rings Theme

{
"--path-color": "#a3a300",
"--prompt-color": "#d4d4aa",
"--command-color": "#5c3317",
"--args-color": "#c19a6b",
"--prompt-symbol": "⚔",
"--title-color": "#b8860b",
"--title-text": "Lord of the Rings",
"--background-color": "#282a36",
"--output-color": "#d2b48c",
"--console-font": "\"Monaco\", monospace"
}

Doctor Who Theme

{
"--path-color": "#0047ab",
"--prompt-color": "#ffffff",
"--command-color": "#ffd700",
"--args-color": "#6495ed",
"--prompt-symbol": "✧",
"--title-color": "#1e90ff",
"--title-text": "Doctor Who",
"--background-color": "#0a0a25",
"--output-color": "#e6e6fa",
"--console-font": "\"Monaco\", monospace"
}

Here are more themes inspired by popular TV shows and movies:
Sherlock Theme

{
"--path-color": "#2d2d2d",
"--prompt-color": "#f1f1f1",
"--command-color": "#9e9e9e",
"--args-color": "#607d8b",
"--prompt-symbol": "❓",
"--title-color": "#455a64",
"--title-text": "Sherlock",
"--background-color": "#1c1c1c",
"--output-color": "#e0e0e0",
"--console-font": "\"Monaco\", monospace"
}

Avatar: The Last Airbender Theme

{
"--path-color": "#ffa726",
"--prompt-color": "#ffffff",
"--command-color": "#29b6f6",
"--args-color": "#66bb6a",
"--prompt-symbol": "🌊",
"--title-color": "#ef5350",
"--title-text": "Avatar: The Last Airbender",
"--background-color": "#37474f",
"--output-color": "#eceff1",
"--console-font": "\"Monaco\", monospace"
}

The Witcher Theme

{
"--path-color": "#4caf50",
"--prompt-color": "#c8e6c9",
"--command-color": "#9e9e9e",
"--args-color": "#ff9800",
"--prompt-symbol": "⚔",
"--title-color": "#607d8b",
"--title-text": "The Witcher",
"--background-color": "#1b1b1b",
"--output-color": "#e0e0e0",
"--console-font": "\"Monaco\", monospace"
}

WandaVision Theme

{
"--path-color": "#bb86fc",
"--prompt-color": "#ffffff",
"--command-color": "#cf6679",
"--args-color": "#03dac6",
"--prompt-symbol": "◉",
"--title-color": "#6200ea",
"--title-text": "WandaVision",
"--background-color": "#121212",
"--output-color": "#e6e6e6",
"--console-font": "\"Monaco\", monospace"
}

Pirates of the Caribbean Theme

{
"--path-color": "#d7b377",
"--prompt-color": "#e0e0e0",
"--command-color": "#5c3317",
"--args-color": "#c19a6b",
"--prompt-symbol": "⚓",
"--title-color": "#8b4513",
"--title-text": "Pirates of the Caribbean",
"--background-color": "#1c1c1c",
"--output-color": "#d2b48c",
"--console-font": "\"Monaco\", monospace"
}

The Mandalorian Theme

{
"--path-color": "#a0a0a0",
"--prompt-color": "#e5e5e5",
"--command-color": "#7c7c7c",
"--args-color": "#ffcc00",
"--prompt-symbol": "⊙",
"--title-color": "#616161",
"--title-text": "The Mandalorian",
"--background-color": "#101010",
"--output-color": "#d4d4d4",
"--console-font": "\"Monaco\", monospace"
}

Dune Theme

{
"--path-color": "#c19a6b",
"--prompt-color": "#f1d8a3",
"--command-color": "#8b4513",
"--args-color": "#e0a96d",
"--prompt-symbol": "☀",
"--title-color": "#d4a372",
"--title-text": "Dune",
"--background-color": "#3b2f2f",
"--output-color": "#f5deb3",
"--console-font": "\"Monaco\", monospace"
}

Rick and Morty Theme

{
"--path-color": "#00ff00",
"--prompt-color": "#ffffff",
"--command-color": "#ff4500",
"--args-color": "#87ceeb",
"--prompt-symbol": "⚛",
"--title-color": "#33cc33",
"--title-text": "Rick and Morty",
"--background-color": "#101010",
"--output-color": "#c0c0c0",
"--console-font": "\"Monaco\", monospace"
}

Blade Runner 2049 Theme

{
"--path-color": "#ff6e40",
"--prompt-color": "#ffffff",
"--command-color": "#03a9f4",
"--args-color": "#ffab40",
"--prompt-symbol": "▣",
"--title-color": "#ff9100",
"--title-text": "Blade Runner 2049",
"--background-color": "#2b2b2b",
"--output-color": "#e0e0e0",
"--console-font": "\"Monaco\", monospace"
}

Stranger Things - Upside Down Theme

{
"--path-color": "#d32f2f",
"--prompt-color": "#ffffff",
"--command-color": "#e57373",
"--args-color": "#b71c1c",
"--prompt-symbol": "⬇",
"--title-color": "#c62828",
"--title-text": "Stranger Things - Upside Down",
"--background-color": "#0a0a0a",
"--output-color": "#c5c5c5",
"--console-font": "\"Monaco\", monospace"
}