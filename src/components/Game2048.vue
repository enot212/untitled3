<template>
  <div class="game-container">
    <h1>2048</h1>

    <div class="board">
      <div
          v-for="(cell, i) in state.board"
          :key="i"
          class="cell"
          :class="'tile-' + cell"
      >
        {{ cell || '' }}
      </div>
    </div>

    <p>Score: {{ state.score }}</p>
    <button @click="reset">New Game</button>
    <p v-if="state.won">🎉 You Win!</p>
    <p v-if="state.over">💀 Game Over</p>
  </div>
</template>

<script setup>
import { reactive, onMounted } from 'vue'

const SIZE = 4

function emptyBoard() {
  return Array(SIZE * SIZE).fill(0)
}

const state = reactive({
  board: emptyBoard(),
  score: 0,
  won: false,
  over: false
})

function idx(r, c) {
  return r * SIZE + c
}

function spawnRandom() {
  const empties = state.board
      .map((v, i) => ({ v, i }))
      .filter(x => x.v === 0)
  if (!empties.length) return
  const pick = empties[Math.floor(Math.random() * empties.length)].i
  state.board[pick] = Math.random() < 0.9 ? 2 : 4
}

function processLine(line) {
  const filtered = line.filter(x => x)
  const result = []
  for (let i = 0; i < filtered.length; i++) {
    if (filtered[i] === filtered[i + 1]) {
      const merged = filtered[i] * 2
      state.score += merged
      result.push(merged)
      i++
    } else {
      result.push(filtered[i])
    }
  }
  while (result.length < SIZE) result.push(0)
  return result
}

function move(direction) {
  let moved = false
  const newBoard = [...state.board]
  const isVertical = direction === 'up' || direction === 'down'
  const isReversed = direction === 'right' || direction === 'down'

  for (let i = 0; i < SIZE; i++) {
    const line = []
    for (let j = 0; j < SIZE; j++) {
      const r = isVertical ? j : i
      const c = isVertical ? i : j
      line.push(state.board[idx(r, c)])
    }
    const processed = processLine(isReversed ? [...line].reverse() : line)
    if (isReversed) processed.reverse()
    for (let j = 0; j < SIZE; j++) {
      const r = isVertical ? j : i
      const c = isVertical ? i : j
      const pos = idx(r, c)
      if (newBoard[pos] !== processed[j]) moved = true
      newBoard[pos] = processed[j]
    }
  }

  if (moved) {
    state.board = newBoard
    spawnRandom()
    checkGameOver()
  }
}

function checkGameOver() {
  if (state.board.includes(0)) return
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      const v = state.board[idx(r, c)]
      if (c + 1 < SIZE && v === state.board[idx(r, c + 1)]) return
      if (r + 1 < SIZE && v === state.board[idx(r + 1, c)]) return
    }
  }
  state.over = true
}

function reset() {
  state.board = emptyBoard()
  state.score = 0
  state.over = false
  state.won = false
  spawnRandom()
  spawnRandom()
}

onMounted(() => {
  reset()
  window.addEventListener('keydown', e => {
    if (state.over || state.won) return
    switch (e.key) {
      case 'ArrowUp': move('up'); break
      case 'ArrowDown': move('down'); break
      case 'ArrowLeft': move('left'); break
      case 'ArrowRight': move('right'); break
    }
  })
})
</script>

<style scoped>
.game-container {
  width: 300px;
  margin: 40px auto;
  text-align: center;
  font-family: sans-serif;
}
.board {
  display: grid;
  grid-template-columns: repeat(4, 60px);
  gap: 13px;
  background: #d2f109;
  padding: 8px;
  border-radius: 6px;
}
.cell {
  width: 60px;
  height: 60px;
  background: #890df3;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 20px;
  border-radius: 4px;
}
.tile-2 { background: #eee4da; }
.tile-4 { background: #21f40a; }
.tile-8 { background: #f10f51; color: white; }
.tile-16 { background: #0bd4dc; color: white; }
.tile-32 { background: #0c0a09; color: white; }
.tile-64 { background: #f3730a; color: white; }
.tile-128 { background: #f805be; color: white; }
.tile-256 { background: #453506; color: white; }
.tile-512 { background: rgba(237, 200, 80, 0.01); color: white; }
.tile-1024 { background: #daf302; color: white; }
.tile-2048 { background: #2e47ed; color: white; }
</style>
