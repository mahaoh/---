var table = document.getElementById('cartTable');
var tbody = table.getElementsByTagName('tbody')[0];
var trs = tbody.children;
var checkAll = document.getElementsByName('checkAll');
var selectedTotal = document.getElementById('selectedTotal');
var deleteAll = document.getElementById('deleteAll');
var preview = document.getElementById('preview');
preview.children[0].onclick = function(){
    preview.style.display = 'none';
}

function refreshTotal(){
    var sum = 0;
    for(var i=0;i<trs.length;i++){
        var tr = trs[i];
        var checked = tr.children[0].children[0].checked;
        var price = +tr.children[2].innerHTML;
        var input = tr.children[3].getElementsByTagName('input')[0];
        var count = +input.value
        var total = price * count;
        tr.children[4].innerHTML = total.toFixed(2);
        sum += checked?total:0;
    }
    document.getElementById('priceTotal').innerHTML = sum.toFixed(2);
}

tbody.onchange = function(e){
    var target = e.target || e.srcElement;
    if(target.type == 'checkbox'){
        var isAllChecked = true;
        var count = trs.length;
        for(var i=0;i<trs.length;i++){
            if(!trs[i].children[0].children[0].checked){
                isAllChecked = false;
                count--;
            }
        }
        selectedTotal.innerHTML = count;
        checkAll[0].checked = checkAll[1].checked = isAllChecked
        refreshTotal()
    }else if(target.type == 'text'){
        refreshTotal()
    }
}

tbody.onclick = function(e){
    var target = e.target || e.srcElement;
    switch(target.className){
        case 'reduce':
            var num = target.parentElement.children[1].value - 1;
            if(num>=0){
                target.parentElement.children[1].value = num;
                refreshTotal()
            }
            break;
        case 'add':
            target.parentElement.children[1].value = (target.parentElement.children[1].value*1 + 1).toFixed(0);
            refreshTotal()
            break;
        case 'delete':
            var tr = target.parentElement.parentElement;
            if(confirm('确定要删除商品【'+tr.children[1].children[1].innerHTML+'】吗？')){
                tbody.removeChild(tr);            
            }
            break;
        case 'img':
            preview.children[0].src = target.src;
            preview.style.display = 'block';
            break;
        default:
            break;
    }
}

deleteAll.onclick = function(){
    var trs = tbody.children;
    var hasChecked = false,names = [];
    for(var i=0;i<trs.length;i++){
        if(trs[i].children[0].children[0].checked){
            hasChecked = true;
            names.push(trs[i].children[1].children[1].innerHTML);
        }
    }
    if(!hasChecked){
        alert('请选择商品');
    }else{
        if(confirm('确定要删除以下这些商品吗？\n' + names.join('\n'))){
            for(var i=0;i<trs.length;i++){
                if(trs[i].children[0].children[0].checked){
                    tbody.removeChild(trs[i--]);
                }
            }            
        }
    }
}

// tbody.addEventListener('keydown', function(e){
//     var target = e.target || e.srcElement;
//     if(target.className == 'count-input'){
//         console.log(e.keyCode)
//         if(e.keyCode < 48 && e.keyCode > 57){
//             e.preventDefault();
//             return false;
//         }    
//     }
// },true);

for(var i=0;i<trs.length;i++){
    trs[i].children[3].children[1].onkeydown = function(e){
        e = e || window.event;
        if(e.keyCode < 48 || e.keyCode > 57){
            e.preventDefault();        
        }
    }
}

for(var i=0;i<checkAll.length;i++){
    checkAll[i].onchange = function(e){
        var target = e.target || e.srcElement;
        var trs = tbody.children;
        selectedTotal.innerHTML = target.checked?trs.length:0;
        for(var i=0;i<trs.length;i++){
            trs[i].children[0].children[0].checked = target.checked;
        }
        refreshTotal()
    }
}

refreshTotal()