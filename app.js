'use strict';
const fs =require('fs');
const readline = require('readline');
const rs =fs.createReadStream('./popu-pref.csv');
const rl = readline.createInterface({ input: rs, output: {} });
const prefectureDataMap = new Map();
//１行ずつイベント発生
rl.on('line', lineString => {
  const columns = lineString.split(',');
  const year = parseInt(columns[0]);
  const prefecture = columns[1];
  const popu = parseInt(columns[3]);
  if (year === 2010 || year === 2015) {
    let value = prefectureDataMap.get(prefecture);
    //初めての県はvalueを追加
    if (!value) {
      value = {
        popu10: 0,
        popu15: 0,
        change: null
      };
    }
    //popuの値を変える
    if (year === 2010 ) {
      value.popu10 = popu;
    }
    if (year === 2015) {
      value.popu15 = popu;
    }
    //Mapに追加、２度目は更新
    prefectureDataMap.set(prefecture, value);
  }
});
rl.on('close', () => {
  //変化率を計算
  for (const [key, value] of prefectureDataMap) {
    value.change = value.popu15 / value.popu10;
  }
  //並べ替え
  const rankingArray = Array.from(prefectureDataMap).sort((pair1, pair2) => {
    return pair2[1].change - pair1[1].change;
  })
  //見やすいように手直し
  const rankingStrings = rankingArray.map(([key, value]) => {
    return (
      key + ': ' + value.popu10 + '=>' + value.popu15 + ' 変化率:' + value.change
    );
  });
  console.log(rankingStrings)
})