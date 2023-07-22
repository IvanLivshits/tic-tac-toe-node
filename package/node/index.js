import * as rl from 'readline';
import * as dotenv from 'dotenv';
import { TicTacToe } from "../index.js";
import { drawBoard } from '../../board/board.js';

dotenv.config();

export class TicTacToeNode extends TicTacToe {
    rlInstance
    constructor(params) {
      super({
        ...params,
        tickCallback: (instance) => {
          instance.rlInstance.question(`${' '.repeat(8)}Print the row and the column for your sign (row, column): `, (ans) => {
            const [row, col] = ans.split(',');
            instance.print([row, col])
          })
        },
        on: {
          win(instance, {next}) {
            instance.rlInstance.question(`${' '.repeat(8)}Do you wanna play again? y/n: `, (ans) => {
              if (ans == 'y') {
                next()
              } else {
                instance.rlInstance.close();
              }
            })
          },
          startTick(instance) {
            drawBoard(instance.board)
          }
        }
      })
      this.rlInstance = rl.createInterface({
        input: process.stdin,
        output: process.stdout
      });
    }
  }