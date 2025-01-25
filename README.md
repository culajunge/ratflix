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
  "--output-color": "#fff"
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
  "--output-color": "#11ff11"
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
  "--output-color": "#ffffff"
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
  "--output-color": "#c9c9ff"
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
  "--output-color": "#ffffff"
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
  "--output-color": "#f8f9fa"
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
  "--output-color": "#ffffff"
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
  "--output-color": "#ffffff"
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
  "--output-color": "#d4d4d4"
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
  "--output-color": "#e0e0e0"
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
  "--output-color": "#f8f8f2"
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
  "--output-color": "#dcdcdc"
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
  "--output-color": "#ecf0f1"
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
  "--output-color": "#f1d8de"
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
  "--output-color": "#e0e0e0"
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
  "--output-color": "#e0e0e0"
}
```