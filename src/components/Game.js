import React, { useReducer } from 'react'
import Board from './Board';

const reducer = (state, action) => {
    switch(action.type){
        case 'JUMP':
            return { ...state, 
                    xIsNext: action.payload.step%2 === 0, 
                    history: state.history.slice(0, action.payload.step + 1), 
                };
        case 'MOVE': 
            return {...state, history: state.history.concat({
                squares: action.payload.squares
            }),
            xIsNext: !state.xIsNext,
        };

        default: return state;
    }
}



export default function Game() {
    
    const [state, dispatch] = useReducer(reducer, {
        xIsNext: true,
        history: [{squares: Array(9).fill(null)}]
    });

    const { xIsNext, history } = state;
    
    if(xIsNext){
        const current = history[history.length - 1];
        const squares = current.squares.slice();

        let i = bestMove(squares);
        squares[i] = 'X';
            
        dispatch({type:'MOVE', payload: { squares }});
    }

    const jumpTo = (step) => {
        dispatch({type: 'JUMP', payload: { step }});
    }

    const handleClick = (i) => {
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        
        if(xIsNext){
            let i = bestMove(squares);
            squares[i] = 'X';
            
            let click_event = new CustomEvent('click');
            let btn_element = document.querySelector('.btn');
            console.log(btn_element);
            btn_element.dispatchEvent(click_event);
            
        }else{
            const winner = calculateWinner(squares);

            if(winner || squares[i]){
                return;
            }

            squares[i] = 'O';
        }
        dispatch({type:'MOVE', payload: { squares }});
    };

    const current = history[history.length - 1];
    const winner = calculateWinner(current.squares);

    const status = winner? winner === 'D' ? 'Draw': 'Winner is ' + winner : "Next player is " + (xIsNext?'X' : 'O');
    const moves = history.map((step, move) => {
        const desc = move ? 'Go to #' + move: 'Start the Game';
        return <li key={move}>
            <button onClick={() => jumpTo(move)}>
                {desc}
            </button>
        </li>
    });

    return <div className={winner?"game disabled" : "game"}>
        <div className="game-board">
            <Board onClick={(i) => handleClick(i)} squares={current.squares}></Board>
        </div>
        <div className="game-info">
            <div>{status}</div>
            <ul>{moves}</ul>
        </div>
    </div>
}

const calculateWinner = (squares) => {
    let isDraw = true;
    //verifying rows
    if(squares[0] === squares[1] && squares[1] === squares[2]){
        return squares[0];
    }
    if(squares[3] === squares[4] && squares[4] === squares[5]){
        return squares[3];
    }
    if(squares[6] === squares[7] && squares[7] === squares[8]){
        return squares[6];
    }

    //verifying columns
    if(squares[0] === squares[3] && squares[3] === squares[6]){
        return squares[0];
    }
    if(squares[1] === squares[4] && squares[4] === squares[7]){
        return squares[1];
    }
    if(squares[2] === squares[5] && squares[5] === squares[8]){
        return squares[2];
    }

    //verifyin diagonals
    if(squares[0] === squares[4] && squares[4] === squares[8]){
        return squares[0];
    }
    if(squares[2] === squares[4] && squares[4] === squares[6]){
        return squares[2];
    }

    isDraw = squares.every(elem => elem != null);
        
    if(isDraw) return 'D';
    return null;
}

function bestMove(squares){
    let bestScore = -Infinity;
    let move;
    for(let i = 0; i < 9; i++){
        if(squares[i] === null){
            squares[i]='X';
            let score = minimax(squares, 0, false);
            squares[i] = null;
            if (score > bestScore){
                bestScore = score;
                move = i;
            }
        }
    }

    return move;
}

let scores = {
    'X': 1,
    'O': -1,
    'D': 0
}

function minimax(squares, depth, isMaximizing){
    let result = calculateWinner(squares);
    if(result !== null){
        return scores[result];
    }

    if(isMaximizing){
        let bestScore = -Infinity;
        for(let i = 0; i < 9; i++){
            if(squares[i] === null){
                squares[i] = 'X';
                let score = minimax(squares, depth + 1, false);
                squares[i] = null;
                bestScore = Math.max(score, bestScore);
            }
        }
        return bestScore;
    }else{
        let bestScore = Infinity;
        for(let i = 0; i < 9; i++){
            if(squares[i] === null){
                squares[i] = 'O';
                let score = minimax(squares, depth + 1, true);
                squares[i] = null;
                bestScore = Math.min(score, bestScore);
            }
        }
        return bestScore;
    }
}