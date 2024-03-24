export const intersect = (rect1, rect2) => {
    for(let i = rect1[0]; i <= rect1[2]; i++) {
        for(let j = rect1[1]; j <= rect1[3]; j++) {
            if(i >= rect2[0] && i <= rect2[2] && j >= rect2[1] && j <= rect2[3]) return true;
        }
    }
    return false;
}

export const isValidPlacement    = (grid, row, col, row2, col2, turn) => {
    const area = (row2 - row + 1) * (col2 - col + 1);
    if ((area !== turn) && (area !== turn + 1)) return false;
    
    // now check that it doesn't intersect with any other pieces
    for(let i = row; i <= row2; i++) {
        for(let j = col; j <= col2; j++) {
            if(grid[i][j] !== null) return false;
        }
    }
    return true;
}