# 🎬 Ratflix

A command-line interface for browsing and streaming movies and TV shows. Navigate through content using familiar terminal-style commands.

## Features
- Search for movies and TV shows
- Browse seasons and episodes
- Track watch history across shows
- Resume from last watched episodes
- Intuitive navigation system

## Commands

| Command | Description |
|---------|-------------|
| `f <search term>` | Find movies and TV shows |
| `cd <index>` | Navigate to selected media |
| `cd ..` | Go back one level |
| `ls` | List available content |
| `p` | Play current media |
| `p <index>` | Play specific episode |
| `n` | Play next episode |
| `l` | Resume last watched episode |
| `ln` | Play next episode of last watched show |
| `hs` | Display watch history |
| `clear` | Clear console |
| `pwd` | Show current path |
| `help` | Display all commands |

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
