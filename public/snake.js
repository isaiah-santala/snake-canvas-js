const map = document.getElementById('snake')
const ctx = map.getContext('2d')
const scale = 12
ctx.scale(scale, scale)

const score = document.getElementById('score')
const incrementScore = () => score.innerHTML = Number(score.innerText) + 1 


const highScore = document.getElementById('highscore')
const snakeHighScore = window.localStorage.getItem('snakeHighScore')
highScore.innerHTML = snakeHighScore || 0

gameOver = () => {
  const score = document.getElementById('score').innerText
  if (score > snakeHighScore || !snakeHighScore) {
    window.localStorage.setItem('snakeHighScore', score)
  }
  window.location.reload(true)
}

let dir = null

const bindings = {
  w: 'UP',
  ArrowUp: 'UP',
  s: 'DOWN',
  ArrowDown: 'DOWN',
  a: 'LEFT',
  ArrowLeft: 'LEFT',
  d: 'RIGHT',
  ArrowRight: 'RIGHT'
}

const directions = (dir) => {
  switch (dir) {
    case 'UP' : return [0, -1]
    case 'DOWN' : return [0, 1]
    case 'LEFT' : return [-1, 0]
    case 'RIGHT' : return [1, 0]
    default : return dir
  }
}

const canMove = (newDir) => {
  if (newDir === 'UP' && dir === 'DOWN') return false
  if (newDir === 'DOWN' && dir === 'UP') return false
  if (newDir === 'LEFT' && dir === 'RIGHT') return false
  if (newDir === 'RIGHT' && dir === 'LEFT') return false
  return true
}

let food = [
  Math.floor(Math.random() * map.width / scale),
  Math.floor(Math.random() * map.height / scale)
]

const genFood = () => {
  food = [
    Math.floor(Math.random() * map.width / scale),
    Math.floor(Math.random() * map.height / scale)
  ]
  snake.forEach(([x, y]) => {
    if (x === food[0] && y === food[1]) genFood()
  })
}

const paintFood = () => {
  ctx.fillStyle = 'red'
  const [x, y] = food
  ctx.fillRect(x, y, 1, 1)
}

const snake = [
  [ 
    map.width / 2 / scale, 
    map.height / 2 / scale
  ]
]

const moveSnake = () => {
  const movement = directions(dir)
  snake.unshift(
    [
      snake[0][0] + movement[0],
      snake[0][1] + movement[1]
    ]
  )
  if (didSnakeEat()) {
    genFood()
    incrementScore()
  }
  else snake.pop()
}

const paintSnake = () => {
  ctx.fillStyle = 'mediumspringgreen'
  snake.forEach(
    ([x, y]) => ctx.fillRect(x, y, 1, 1)
  )
}

const didSnakeDie = () => {
  const [[x, y], ...tail] = snake
  if (
    x < 0 ||
    x >= map.width / scale
    || y < 0
    || y >= map.height / scale
  ) gameOver()

  tail.forEach(([tx, ty]) => {
    if (x === tx && y === ty) gameOver()
  })
}

const didSnakeEat = () => {
  const [[x, y], ...tail] = snake
  const [fx, fy] = food
  return (x === fx && y === fy)
}

const clearMap = () => ctx.clearRect(0, 0, 24, 36)

const paintMap = () => {
  paintSnake()
  paintFood()
}

const gameLoop = () => {
  if (dir) {
    moveSnake()
    didSnakeDie()
  }
  clearMap()
  paintMap()
}

const handleKeyDown = ({ key }) => {
  const newDir = bindings[key]
  if (canMove(newDir)) {
    dir = newDir
    gameLoop()
  } 
}

const step = setInterval(gameLoop, 200)

document.addEventListener('keydown', handleKeyDown, false)
