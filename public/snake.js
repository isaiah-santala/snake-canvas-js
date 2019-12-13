const map = document.getElementById('snake')
const ctx = map.getContext('2d')
const scale = 15
ctx.scale(scale, scale)

const score = document.getElementById('score')
const incrementScore = () => score.innerHTML = Number(score.innerText) + 1 

const highScore = document.getElementById('highscore')
const snakeHighScore = window.localStorage.getItem('snakeHighScore')
highScore.innerHTML = snakeHighScore || 0

gameOver = () => {
  const score = document.getElementById('score').innerText
  if (Number(score) > Number(snakeHighScore) || !snakeHighScore) {
    window.localStorage.setItem('snakeHighScore', score)
  }
  window.location.reload(true)
}

let dir = null
let movement = null

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

const keyIsValid = (newDir) => {
  if (!newDir) return false
  if (snake.length === 1) return true
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

let snake = [
  [ 
    map.width / 2 / scale, 
    map.height / 2 / scale
  ]
]

const moveSnake = () => {
  snake.unshift(genHead())
  if (didSnakeEat()) {
    genFood()
    incrementScore()
  }
  else snake.pop()
  didSnakeDie()
}

const genHead = () => {
  let newHead = [
    snake[0][0] + movement[0],
    snake[0][1] + movement[1]
  ]
  let [x, y] = newHead
  if (x < 0) x = map.width / scale + x
  if (y < 0) y = map.height / scale + y
  if (x >= map.width / scale) x = 0
  if (y >= map.height / scale) y = 0
  return[x, y]
}

const paintSnake = () => {
  ctx.fillStyle = 'mediumspringgreen'
  snake.forEach(
    ([x, y]) => ctx.fillRect(x, y, 1, 1)
  )
}

const didSnakeExceedBorders = () => {
  snake = snake.map(([x, y]) => {
    if (x < 0) x = map.width / scale + x
    if (y < 0) y = map.height / scale + y
    if (x >= map.width / scale) x = 0
    if (y >= map.height / scale) y = 0
    return [x, y]
  })
}

const didSnakeDie = () => {
  const [[x, y], ...tail] = snake
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

let playerHasNotMovedThisTick = true

const gameLoop = () => {
  if (dir) {
    moveSnake()
  }
  clearMap()
  paintMap()
  playerHasNotMovedThisTick = false
}

const autoTick = () => {
  if (playerHasNotMovedThisTick) gameLoop()
  playerHasNotMovedThisTick = true
}

const handleKeyDown = ({ key }) => {
  const newDir = bindings[key]
  if (keyIsValid(newDir)) {
    dir = newDir
    movement = directions(dir)
    gameLoop()
  } 
}

const step = setInterval(autoTick, 150)

document.addEventListener('keydown', handleKeyDown, false)
