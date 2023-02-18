// sessionStorageから店舗情報を取得し、それをオブジェクトに戻す
var shopInformation = JSON.parse(sessionStorage.getItem("shopInformation"));
// 一覧を表示するための親要素を取得する
var lists = document.getElementById("lists");
// 1ページあたりの最大ページ数
var pageCount = 5;

// list.htmlにアクセスしたとき
window.onload = function(){
    if(shopInformation == null){
        // top.htmlにアクセスせずにlist.htmlに初めてアクセスした場合は、top.htmlに戻す
        window.location.href = "top.html";
    }else if(Object.keys(shopInformation).length != 0){
        // 店舗が1件以上ヒットすれば
        // 店舗情報を一覧で表示し、それをページネーションに対応させる
        pagination();
    }else{
        // 店舗が1件もヒットしなければ
        // h2要素を追加する
        var notHitMassage = document.createElement("h2");
        // h2要素にテキストを設定する
        notHitMassage.textContent = "付近に店舗はありませんでした。検索条件を変更してください。";
        // h2要素にidを設定する
        notHitMassage.id = "notHitMassage";
        // h2を親要素のlistsに追加する
        lists.appendChild(notHitMassage);
    }
}

// ページネーションに対応させる関数
function pagination(){
    $("#page").pagination({
        dataSource: shopInformation,
        // 1ページあたりの表示数
        pageSize: pageCount,
        callback: function(shopInfoArray) {
            $("#lists").html(list(shopInfoArray));
        }
    });
    // 1店舗あたりの情報
    function list(shopInfoArray) {
        // 詳細画面で使うための店舗情報をsessionStorageに保存する
        sessionStorage.setItem("shopInformationDetail",JSON.stringify(shopInfoArray));

        return shopInfoArray.map(function(shopInfo,index) {
            return "<div id=shopInfo>"
            +"<h3>"+shopInfo.name+"</h3>"
            +"<p>"+shopInfo.access+"</p>"
            +"<img src="+shopInfo.logo_image+"></img>"
            +"<div id=detailButtonDiv>"
            +"<a id = detailButton onclick = transitionDetail("+index+")>詳細を見る</a>"
            +"</div>"
            +"</div>"
        })
    }
}

// shopInformationDetailの要素番号をsessionStorageに保存して、detail.htmlに遷移する
function transitionDetail(index){
    // 詳細画面で使うための店舗情報の要素番号をsessionStorageに保存する
    sessionStorage.setItem("shopIndex",index);
    // detail.htmlに遷移する
    window.location.href = "detail.html";
}