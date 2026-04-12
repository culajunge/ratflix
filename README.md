<h1>
  <img src="public/ratflix.webp" alt="Logo" width="100" style="vertical-align: middle;">
  Ratflix
</h1>

A command-line interface for browsing and streaming movies and TV shows. Navigate through content using familiar
terminal-style commands.
But if you're a noob: there's a gui for you now :)

## Features

- Netflix but free duh

## Commands

(may be outdated, run `help` for latest)

| Command           | Description                            |
|-------------------|----------------------------------------|
| `gui`             | Switch to GUI                          |
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

