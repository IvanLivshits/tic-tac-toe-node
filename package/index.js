import { initBoard } from "../board/board.js"
import { CONFIG } from "../config/index.js"
import { changePlayer } from "../logic/changePlayerLogic.js"
import isWin from "../logic/checkWin.js"
import { checkConditions } from "../logic/conditionsLogic.js"

export class TicTacToe {
    board
    counter = 0
    currentPlayer = CONFIG.FIRST_PLAYER
    on
    errorDuration
    tickCallback
    constructor({on, tickCallback, errorDuration = 5000} = {}) {
      this.setBoard(initBoard())
      this.on = on
      this.errorDuration = errorDuration
      this.tickCallback = tickCallback
    }
    setCounter(value) {
      this.counter = value
      this.on?.setCounter?.(this)
    }
    setPlayer(player) {
      this.currentPlayer = player
      this.on?.setPlayer?.(this)
    }
    setBoard(board) {
      this.board = board
      this.on?.setBoard?.(this)
    }
    changePlayer(current = this.currentPlayer) {
      this.setPlayer(changePlayer(current))
    }
    reset() {
      this.setCounter(0)
      this.setPlayer(CONFIG.FIRST_PLAYER)
      this.setBoard(initBoard())
      this.on?.reset?.(this)
    }
    win() {
      const winner = changePlayer(this.currentPlayer)
      console.log(' '.repeat(8) + `Player with sign '${winner}' won!`);
      const next = () => {
        this.play()
      }
      const winData = {
        winner,
        board: this.board,
        next: next.bind(this)
      }
      this.reset()
      this.on?.win?.(this, winData)
    }
    play() {
      this.on?.play?.(this)
      return this.tick()
    }
    print([row,col]) {
      const isConditions = checkConditions(row, col, this.board)
      if (isConditions.status) {
        this.setBoard((() => {
          const newBoard = [...this.board]
          newBoard[Number(row) - 1][Number(col) - 1] = this.currentPlayer
          return newBoard
        })());
        this.changePlayer()
      } else {
        return {
          error: isConditions,
          tickResult: new Promise((resolve) => setTimeout(() => resolve(this.tick()), this.errorDuration))
        };
      }
      return {
        error: isConditions,
        tickResult: this.tick()
      }
    }
    tick() {
      this.on?.startTick?.(this)
      
      if (this.counter >= 5 && isWin(this.board)) {
        this.win()
        return
      } else if (this.counter === 9) {
        this.on?.draw?.(this)
        console.log(' '.repeat(8) + 'Draw!')
        return
      }
  
      this.setCounter(this.counter + 1)
  
      if (this.tickCallback) {
        this.on?.endTick?.(this)
        return this.tickCallback?.(this)
      }
      this.on?.endTick?.(this)
      return ([row, col]) => {
        this.print([row, col])
      }
    }
  }