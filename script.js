let body = document.body;

body.oncontextmenu = function (e) {
    return false;
}

let board = document.getElementsByClassName("game")[0];
let height = 20;
let width = 30;
let countBombs = 100;
let isFirstOpen = true;
let isFlag = false;

function placeFlag(){
    if (this.classList[1] != "clear"){
        this.classList.toggle("flag");
    }
}

function PlaceBombs(cell){
    let rows = Array.from(cell.parentNode.parentNode.getElementsByClassName("row"));
    let x = Array.from(cell.parentNode.childNodes).indexOf(cell);
    let y = rows.indexOf(cell.parentNode);
    let area = [[x-1,y-1],[x,y-1],[x+1,y-1],[x-1,y],[x+1,y],[x-1,y+1],[x,y+1],[x+1,y+1]];
    for (let h = 0; h < countBombs; h++){
        let clear_cells = document.querySelectorAll("#close");
        let rand = Math.floor(Math.random() * clear_cells.length);
        let not_first_eight = true;
        for (let i = 0; i < 8; i++){
            try{
                if (clear_cells[rand] == Array.from(rows[area[i][1]].childNodes)[area[i][0]]){
                    not_first_eight = false;
                    break;
                }
            }
            catch(e){
                continue
            }
        }
        while (not_first_eight == false){
            rand = Math.floor(Math.random() * clear_cells.length);
            not_first_eight = true;
            for (let i = 0; i < 8; i++){
                try{
                    if (clear_cells[rand] == Array.from(rows[area[i][1]].childNodes)[area[i][0]]){
                        not_first_eight = false;
                        break;
                    }
                }
                catch(e){
                    continue
                }
            }
        }
        clear_cells[rand].classList.remove("clear");
        clear_cells[rand].id = "bomb";
    }
}

function checkBombsOne(cell){
    let rows = Array.from(cell.parentNode.parentElement.getElementsByClassName("row"));
    let x = Array.from(cell.parentNode.childNodes).indexOf(cell);
    let y = rows.indexOf(cell.parentElement);
    let area = [[x-1,y-1],[x,y-1],[x+1,y-1],[x-1,y],[x+1,y],[x-1,y+1],[x,y+1],[x+1,y+1]];
    let cur_bomb = 0;
    for (let i = 0; i < 8; i++){
        try{
            if (Array.from(rows[area[i][1]].childNodes)[area[i][0]].id == "bomb"){
                cur_bomb ++;
            }
        }
        catch(e){
            continue;
        }
    }
    if (cur_bomb != 0){
        cell.textContent = cur_bomb;
    }
    else{
        for (let i = 0; i < 8; i++){
            try{
                if (Array.from(rows[area[i][1]].childNodes)[area[i][0]].id == "close"){
                    Array.from(rows[area[i][1]].childNodes)[area[i][0]].click();
                }
            }
            catch(e){
                    continue;
            }
        }
    }    
}

function firstOpen(cell){
    isFirstOpen = false;
    cell.classList.add("clear");
    cell.id = "clear";
    let column_cells = Array.from(cell.parentNode.childNodes);
    let rows = Array.from(cell.parentNode.parentNode.getElementsByClassName("row"));
    let x = column_cells.indexOf(cell);
    let y = rows.indexOf(cell.parentNode);
    let area = [[x-1,y-1],[x,y-1],[x+1,y-1],[x-1,y],[x+1,y],[x-1,y+1],[x,y+1],[x+1,y+1]];
    PlaceBombs(cell);
    for (let i = 0; i < 8; i++){
        try{
            let row = rows[area[i][1]];
            let area_cell = row.getElementsByTagName("div")[area[i][0]];
            area_cell.click();
        }
        catch(e){
            continue;
        }
    }
}

function openCell(){
    if (isFirstOpen){
        firstOpen(this);
    }
    else if (this.id == "close"){
        this.classList.add("clear");
        this.id = "clear";
        this.classList.add("not_checked");
        checkBombsOne(this);
    }
    else if (this.id == "bomb" && this.classList[1] != "flag"){
        let bombs = document.querySelectorAll("#bomb");
        for (let i = 0; i < bombs.length; i++){
            bombs[i].classList.add("bomb");
        }
    }
}

for (let i = 0; i < height; i++){
    let row = document.createElement("div");
    row.classList.add("row");
    for (let j = 0; j < width; j++){
        let cell = document.createElement("div");
        cell.classList.add("cell");
        cell.setAttribute("id", "close");
        cell.addEventListener("click", openCell);
        cell.addEventListener("contextmenu", placeFlag)
        row.append(cell);
    }
    board.append(row);
}