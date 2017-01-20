class Element {
	constructor(originElement, relativePostition, menuItems) {
		this.originElement = originElement;
		this.relativePostition = relativePostition;
		this.menuItems = menuItems;
	}
	
	get id(){
		return this.originElement;
	}
	
	get placement(){
		return this.relativePosition;
	}
	
	menuItems(){
		return this.menuItems;
	}
}

class Dictionary{
	constructor(title, contents){
		this.title = title;
		this.contents = contents;
	}
	
	title(){
		return this.title;
	}
	
	contents(){
		return this.contents;
	}
}

//initalize menuItems dictionary
{
var dictionary = [];
dictionary.push("Item 1");
dictionary.push("Item 2");
dictionary7 = [];
dictionary7.push("Item 7-1");
dictionary7.push("Item 7-2");
dictionary7.push("Item 7-3");
dictionary7.push("Item 7-4");
dictionary.push(new Dictionary("Item 7", dictionary7));
dictionary.push("Item 8");
var dictionary2 = [];
dictionary2.push("Item 3-1");
dictionary2.push("Item 3-2");
dictionary2.push("Item 3-3");
dictionary.push(new Dictionary("Item 3", dictionary2));
dictionary.push("Item 4");
dictionary5 = [];
dictionary5.push("Item 5-1");
dictionary5.push("Item 5-2");
dictionary.push(new Dictionary("Item 5", dictionary5));
dictionary.push("Item 6");

//constructs the popover
//right isn't working for some reason
var element = new Element("#pop", "right", new Dictionary("Items", dictionary));

//creates popover
$(function () {
    $(element.id).popover({
		html: true,
        content : function(){
			return $(this).parent().find('.popover-contents').html();
		},
        title : element.menuItems.title,
		placement : element.placement
    });
});

var subMenuCount = 0; //counts the number of submenus, helps with distinguinshing one from another, needs to be global
//dynamically updates an unordered list (within the popover)
$(document).ready(function() {
	
	//for every item in the dictionary, add it to the popover
    $.each(dictionary, function(i) {
		 if (dictionary[i] instanceof Object){
			$("#list2").append(`<a href="#" data-toggle="dropdown" class="dropdown-toggle">` + dictionary[i].title + `<b class="caret"></b></a>`);
			addSubMenu(dictionary[i].contents, "#list2", subMenuCount);
			subMenuCount++;
		 } else{
			$("#list2").append(`<li class="item"><a href="#">` + dictionary[i] + `</a></li>`);
		 } 
    });
});

$('.dropdown-submenu a.test').on("click", function(e){
    $(this).next('ul').toggle();
    e.stopPropagation();
    e.preventDefault();
});

function addSubMenu(array, listParent, subMenu) {
	var menu_tag = `"menu`+ subMenu +`"`;
	console.log(menu_tag);
    $(listParent).append(`<ul class="dropdown-menu" id=`+ menu_tag +`">`);
	for (i = 0; i < array.length; i++) {
		var menu_tag_without = `#menu`+ subMenu;
		console.log(menu_tag_without);
		if (array[i] instanceof Object){
			$(listParent).append(`<a href="#" data-toggle="dropdown" class="dropdown-toggle">` + array[i].title + `<b class="caret"></b></a>`);
			addSubMenu(array[i].contents, listParent, subMenuCount);
			subMenuCount++;
		} else {
			$(menu_tag_without).append(`<li class="item"><a href="#">` + array[i] + `</a></li>`);
		}
	}
	$(listParent).append(`</ul>`);
	return;
}