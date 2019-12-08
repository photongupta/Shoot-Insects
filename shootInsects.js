const { stdout, stdin, exit } = process;
const insects = ["🐞", "🐜", "🐝", "🐛", "🕷", "🦗", "🦟", "🦂", "🐞"];
const insectStore = [{ type: "🐞", x: 5, y: 7 }];
const insectShooter = { type: "🙅🏻‍♀️", x: 54, y: 34 };
const pesticideStore = [];

process.stdin.setRawMode("true");

const killAndCount = function() {
  let score = 0;
  return function() {
    insectStore.forEach(insectDetail => {
      pesticideStore.forEach(pesticideDetail => {
        const res =
          insectDetail.x == pesticideDetail.x + 1 &&
          insectDetail.y == pesticideDetail.y - 1;
        const res1 =
          insectDetail.x + 1 == pesticideDetail.x &&
          insectDetail.y == pesticideDetail.y - 1;
        const res2 =
          insectDetail.x == pesticideDetail.x &&
          insectDetail.y == pesticideDetail.y - 1;

        if (res || res1 || res2) {
          score = score + 1;
          pesticideStore.splice(pesticideStore.indexOf(pesticideDetail), 1);
          insectStore.splice(insectStore.indexOf(insectDetail), 1);
        }
        if (pesticideDetail.y == 5) {
          pesticideStore.splice(pesticideStore.indexOf(pesticideDetail), 1);
        }
      });
    });
    return score;
  };
};

const pestFirm = function() {
  let pesticideDetail = {};
  pesticideDetail.type = "🦠";
  pesticideDetail.x = insectShooter.x;
  pesticideDetail.y = insectShooter.y - 1;
  pesticideStore.push(pesticideDetail);
};

const insertPesticideOnBoard = function() {
  pesticideStore.forEach(pesticideDetail => {
    stdout.cursorTo(pesticideDetail.x, pesticideDetail.y);
    stdout.write(pesticideDetail.type);
    pesticideDetail.y -= 1;
  });
};

const insertInsects = function(columns) {
  let newInsectDetail = {};
  totalInsects = insects.length;
  newInsectDetail.type = insects[Math.floor(Math.random() * totalInsects)];
  newInsectDetail.x = Math.floor(Math.random() * columns - 5);
  newInsectDetail.y = 7;
  insectStore.push(newInsectDetail);
};

const insertShooterOnTheBoard = function() {
  stdout.cursorTo(insectShooter.x, insectShooter.y);
  stdout.write(insectShooter.type);
};

const insertInsectsOnBoard = function() {
  insectStore.forEach(insectDetail => {
    stdout.cursorTo(insectDetail.x, insectDetail.y);
    stdout.write(insectDetail.type);
    insectDetail.y += 1;
  });
};

const drawLowerBoundaries = function(columns) {
  stdout.cursorTo(1, columns - 3);
  stdout.write("-*-".repeat(columns / 3));
};

const drawUpperBoundaries = function(rows, columns) {
  stdout.cursorTo(0, 1);
  stdout.clearScreenDown();
  stdout.write("-*-".repeat(columns / 3));
  stdout.cursorTo(columns - 65, 3);
  stdout.write("Shoot Insects");
  stdout.cursorTo(1, 5);
  stdout.write("---".repeat(columns / 3));
};

const getScore = function(score) {
  stdout.cursorTo(100, 7);
  stdout.write(`score:${score}`);
};

const drawBoards = function(rows, columns, killInsect) {
  drawUpperBoundaries(rows, columns);
  insertInsectsOnBoard();
  insertShooterOnTheBoard();
  insertPesticideOnBoard();
  drawLowerBoundaries(columns);
  let score = killInsect();
  getScore(score);
};

const main = function() {
  const killInsect = killAndCount();
  const columns = stdout.columns - 2;
  const rows = stdout.rows;
  setInterval(drawBoards, 200, rows, columns, killInsect);
  setInterval(insertInsects, 800, columns);
  stdin.on("data", position => {
    if (position == "l") {
      insectShooter.x -= 1;
    }
    if (position == "r") {
      insectShooter.x += 1;
    }
    if (position == "w") {
      pestFirm();
    }
    if (position == "q") {
      exit();
    }
  });
};

main();
