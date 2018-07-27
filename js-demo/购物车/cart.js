var trs = cartTable.tBodies[0].rows;
for(var i=0;i<trs.length;i++){
	trs[i].index = i;
}
function total(){
	var totalPrice = 0;
	var totalCount = 0;

	for(var i=0;i<trs.length;i++){
		// trs[i].index = i;
		var checkbox = trs[i].firstElementChild.firstElementChild;
		if(checkbox.checked){
			var num = parseInt(trs[i].children[3].children[1].value);
			var oneTotal = parseFloat(trs[i].children[4].innerHTML);
			totalCount += num;
			totalPrice += oneTotal;
			trs[i].style.background = "#EEF6FF";
		}else{
			trs[i].style.background = "#fff";
		}
	}
	selectedTotal.innerHTML = totalCount;
	priceTotal.innerHTML = totalPrice.toFixed(2);
}

total();

function show(flag,del){
	var imgs = view.querySelectorAll("img");
	var tempArr = [];
	for(var i=0;i<imgs.length;i++){
		tempArr.push(imgs[i].getAttribute("index"));
	}
	// 添加展示图片
	for(var i=0;i<trs.length;i++){
		var checkbox = trs[i].firstElementChild.firstElementChild;
		if(checkbox.checked && tempArr.indexOf(trs[i].children[1].firstElementChild.getAttribute("index")) == -1){
			var src = trs[i].children[1].firstElementChild.src;
			var index = trs[i].children[1].firstElementChild.getAttribute("index");
			var div = document.createElement("div");
			div.innerHTML = "<img src='" + src+ "' index='" + index + "'><span class='cancel'>取消选择</span>";
			selectedViewList.appendChild(div);
		}
	}
	// 删除展示图片
	var showImgs = selectedViewList.children;

	for(var i=showImgs.length - 1;i>=0;i--){
		if(flag == "allNo"){
			selectedViewList.removeChild(showImgs[i]);
		}else if(flag.index == showImgs[i].firstElementChild.getAttribute("index") && !flag.firstElementChild.firstElementChild.checked){
			selectedViewList.removeChild(showImgs[i]);
		}else if(flag.index == showImgs[i].firstElementChild.getAttribute("index") && del){
			selectedViewList.removeChild(showImgs[i]);
		}
	}

	

}
show("all");

// 事件委托
document.body.onclick = function(e){
	var evt = e || window.event;
	// 目标元素的兼容
	var target = evt.target || evt.srcElement;
	// 全选功能
	if(target.classList[0] == "check-all"){
		for(var i=0;i<trs.length;i++){
			var checkbox = trs[i].firstElementChild.firstElementChild;
			if(target.checked){
				checkbox.checked = true;
				show("all");
			}else{
				checkbox.checked = false;
				show("allNo")
			}
		}
		total();
		
	}
	// 单选功能
	if(target.classList[0] == "check-one"){
		total();
		show(target.parentNode.parentNode);
	}
	// 加减按钮
	if(target.className == "add"){
		var checkbox = target.parentNode.parentNode.firstElementChild.firstElementChild;
		var count = target.previousElementSibling.value;
		count++;
		if(count > 1){
			target.previousElementSibling.previousElementSibling.innerHTML = "-";
		}
		target.previousElementSibling.value = count;
		var onePrice = target.parentNode.previousElementSibling.innerHTML;
		target.parentNode.nextElementSibling.innerHTML = (count*onePrice).toFixed(2);
		if(checkbox.checked){
			total();
		}
	}
	if(target.className == "reduce"){
		var checkbox = target.parentNode.parentNode.firstElementChild.firstElementChild;
		var count = target.nextElementSibling.value;
		count--;
		if(count <= 1){
			target.innerHTML = "";
			count = 1;
		}
		target.nextElementSibling.value = count;
		var onePrice = target.parentNode.previousElementSibling.innerHTML;
		target.parentNode.nextElementSibling.innerHTML = (count*onePrice).toFixed(2);
		if(checkbox.checked){
			total();
		}
	}

	// 单个删除
	if(target.className == "delete"){
		var checkbox = target.parentNode.parentNode.firstElementChild.firstElementChild;
		if(!checkbox.checked){
			alert("请选中后再删除...");
		}else{
			if(confirm("您确定要删除该商品吗？")){
				show(target.parentNode.parentNode,"delete");
				target.parentNode.parentNode.parentNode.removeChild(target.parentNode.parentNode);
				total();

			}
		}
	}
	// 多个选中删除
	if(target.id == "deleteAll"){
		var mark = false;// 没有被选中的商品
		for(var i=0;i<trs.length;i++){
			var checkbox =  trs[i].firstElementChild.firstElementChild;
			if(checkbox.checked){
				mark = true; // 有被选中的商品
				break;
			}
		}
		if(mark){
			if(confirm("您确定要删除吗？")){
				for(var i=trs.length - 1;i>=0;i--){
					var checkbox =  trs[i].firstElementChild.firstElementChild;
					if(checkbox.checked){
						show(trs[i],"delete");
						trs[i].parentNode.removeChild(trs[i]);
					}
				}
				total();
			}
		}else{
			alert("请选中后再删除");
		}
	}

	// 图片放大
	if(target.className == "img"){
		var fragment = document.createDocumentFragment();
		var cover = document.createElement("div");
		cover.id = "cover";
		var imgDiv = document.createElement("div");
		imgDiv.id = "imgDiv";
		imgDiv.innerHTML = "<img src='" + target.src + "'>";
		fragment.appendChild(cover);
		fragment.appendChild(imgDiv);
		document.body.appendChild(fragment);
		imgDiv.onclick = function(){
			document.body.removeChild(cover);
			document.body.removeChild(imgDiv);
		}
	}

	// 选中商品图展示:down 收起 up 展开
	if(target.classList[1] == "up"){
		view.style.display = "none";
		target.style.display = "none";
		target.nextElementSibling.style.display = "inline-block";
	}

	if(target.classList[1] == "down"){
		view.style.display = "block";
		target.style.display = "none";
		target.previousElementSibling.style.display = "inline-block";
	}
	// 取消选择
	if(target.className == "cancel"){
		for(var i=0;i<trs.length;i++){
			if(trs[i].index == target.previousElementSibling.getAttribute("index")){
				trs[i].firstElementChild.firstElementChild.checked = false;;
			}
		}
		target.parentNode.parentNode.removeChild(target.parentNode);
		total();
	}
}


// var ipts = document.getElementsByTagName("input");
// for(var i=0;i<ipts.length;i++){
// 	ipts[i].onkeypress = function(e){
// 		var evt = e || window.event;
// 		var buttonValue = evt.keyCode;
// 		if(buttonValue >= 48 && buttonValue <= 57){
// 			evt.returnValue = true;
// 		}else{
// 			evt.returnValue = false;
// 		}
// 	}
// 	ipts[i].onblur = function(){
// 		console.log(this.value);
// 	}
// }
