//対応しているかの判定用変数
var correspondenceFlag = false;
// permissionというidの要素を取得する
var permission = document.getElementById("permission");
// messageAreaというidの要素を取得する
var messageArea = document.getElementById("messageArea");
// searchConditionというidの要素を取得する
var searchCondition = document.getElementById("searchCondition");
// searchConditionButtonというidの要素を取得する
var searchConditionButton = document.getElementById("searchConditionButton");
// 現在位置と検索半径を入れておくための配列
var currentConditions = new Array(3);
// 店舗の情報を入れておく
var shopInformation = null;
// sessionStorageから位置情報を許可したかの情報を取得する
var sessionCorrespondence = sessionStorage.getItem("correspondence");

// APIキー
var ApiKey = "APIキー";

// top.htmlにアクセスしたとき
window.onload = function(){
    // 位置情報を許可しているのならば
    if(sessionCorrespondence != null){
        // 要素の追加と削除を行う
        elementChange();
    }
}

// 検索条件用
// 検索半径用
// selectのoptionのMapオブジェクト
var optionValueMap = new Map([["300m",1],["500m",2],["1000m",3],["2000m",4],["3000m",5]]);

// ブラウザがGeolocationAPIが対応しているかを確認する関数
function correspondenceConfirmation(){
    if(navigator.geolocation){
        // 対応している場合
        correspondenceFlag = true;
        // 許可したかをsessionStorageに保存する
        sessionStorage.setItem("correspondence",correspondenceFlag);
    }
}
//GeolocationAPIによる位置情報の取得
function currentLocation(){
    navigator.geolocation.getCurrentPosition(getSuccess,getError);
}
//位置情報の取得に成功した場合
function getSuccess(position){
    // currentConditionsに緯度を入れる
    currentConditions[1] = position.coords.latitude;
    // currentConditionsに経度を入れる
    currentConditions[2] = position.coords.longitude;

    // ホットペッパーグルメリサーチAPIで検索する
    hotPepperApiSearch();
}
//位置情報の取得に失敗した場合
function getError(){
    alert("現在位置を取得できません");
}

// 検索条件用
// 半径で検索するための要素の追加する関数
function addSearchDistance(){
    // h2要素を追加する
    var searchDistanceSentence = document.createElement("h2");
    // h2要素にテキストを設定する
    searchDistanceSentence.textContent = "検索半径";
    // h2要素にidを設定する
    searchDistanceSentence.id = "searchDistanceSentence";
    // h2を親要素のsearchConditionに追加する
    searchCondition.appendChild(searchDistanceSentence);

    // select要素を追加する
    var searchDistanceSelect = document.createElement("select");
    // selectのoption用配列
    var distanceOptionArray = new Array(5);
    // Mapの反復処理
    for(var [key,value] of optionValueMap){
        // option要素を追加する
        distanceOptionArray[value-1] = document.createElement("option");
        // optionのtextを設定する
        distanceOptionArray[value-1].text = key;
        // optionのvalueを設定する
        distanceOptionArray[value-1].value = value;
        // optionを親要素のselectに追加する
        searchDistanceSelect.appendChild(distanceOptionArray[value-1]);
    }
    // searchDistanceSelectのidを設定する
    searchDistanceSelect.id = "searchDistanceSelect";
    // selectを親要素のsearchConditionに追加する
    searchCondition.appendChild(searchDistanceSelect);
}

// 各要素の追加と削除を行う関数
function elementChange(){
    // permissionを削除する
    permission.remove();
    // 子要素がない場合は、検索条件用の要素を追加する
    if(!searchCondition.hasChildNodes()){
        // 半径で検索できるようにする
        addSearchDistance();

        // 検索用のa要素を配置する
        // a要素を追加する
        var searchButton = document.createElement("a");
        // a要素にテキストを設定する
        searchButton.textContent = "検索する";
        // a要素にidを設定する
        searchButton.id = "searchButton";
        // a要素にイベントを設定する
        searchButton.onclick = function(){
            searchButtonClick();
        };
        // a要素を親要素のsearchConditionに追加する
        searchConditionButton.appendChild(searchButton);
    }
}

// 検索ボタンを押したときの処理
function searchButtonClick(){
    //検索半径の番号をcurrentConditionsに入れる
    currentConditions[0] = document.getElementById("searchDistanceSelect").value;
    //現在位置の取得結果からホットペッパーグルメリサーチAPIで検索する
    currentLocation();
}

// ホットペッパーグルメリサーチAPIで検索するための関数
function hotPepperApiSearch(){
    var URL = "https://webservice.recruit.co.jp/hotpepper/gourmet/v1/"+
    "?key="+ApiKey+
    "&lat="+currentConditions[1].toString()+
    "&lng="+currentConditions[2].toString()+
    "&range="+currentConditions[0]+
    // クロスドメインリクエスト問題回避のため
    "&format=jsonp"+
    "&callback=callback";

    $.ajax({
        url: URL,
        type: "GET",
        dataType: "jsonp",
        jsonpCallback: "callback"
    }).done(function(data) {
        // 通信成功時
        // Object型から配列へと変換し、必要な店舗の情報だけ抜き出す
        shopInformation = Object.entries(data).pop().pop().shop;

        // sessionStorageに保存する
        sessionStorage.setItem("shopInformation",JSON.stringify(shopInformation));
        // list.htmlに遷移する
        window.location.href = "list.html";
    }).fail(function() {
        // 通信失敗時
        alert("通信に失敗しました");
    });
}

//位置情報を許可した場合の処理を行う関数
function permissionYes(){
    correspondenceConfirmation();
    if(correspondenceFlag){
        // 対応している場合
        //要素の追加と削除を行う
        elementChange();
    }else{
        // 対応していない場合
        messageArea.textContent = "ブラウザが対応していません";
    }
}
//位置情報を許可しなかった場合の処理を行う関数
function permissionNo(){
    messageArea.textContent = "※許可されないと機能を利用できません";
}
