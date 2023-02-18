// sessionStorageから店舗情報を取得し、それをオブジェクトに戻す
var shopInformationDetail = JSON.parse(sessionStorage.getItem("shopInformationDetail"));
// sessionStorageから店舗情報の要素番号を取得する
var shopIndex = sessionStorage.getItem("shopIndex");

// detail.htmlにアクセスしたとき
window.onload = function(){
    if(shopIndex == null){
        // list.htmlにアクセスせずにdetail.htmlに初めてアクセスした場合は、list.htmlに戻す
        window.location.href = "list.html";
    }else{
        // 店舗の詳細情報をテーブルへと生成する
        putTable();
    }
}

// テーブルの要素を取得し、そこに店舗の詳細情報を生成する関数
function putTable(){
    // 店舗名称の要素を取得する
    var shopName = document.getElementById("shopName");
    // 住所の要素を取得する
    var shopAddress = document.getElementById("shopAddress");
    // 営業時間の要素を取得する
    var shopTime = document.getElementById("shopTime");
    // 画像の要素を取得する
    var shopImage = document.getElementById("shopImage");

    // 店舗名称の要素に詳細情報を生成する
    shopName.textContent = shopInformationDetail[shopIndex].name;
    // 住所の要素に詳細情報を生成する
    shopAddress.textContent = shopInformationDetail[shopIndex].address;
    // 営業時間の要素に詳細情報を生成する
    shopTime.textContent = shopInformationDetail[shopIndex].open;

    // img要素を追加する
    var image = document.createElement("img");
    image.src = shopInformationDetail[shopIndex].photo.pc.l;
    // imgを親要素のshopImageに追加する
    shopImage.appendChild(image);
}