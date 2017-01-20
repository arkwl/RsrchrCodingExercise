//popover class
class Element {
	constructor(originElement, relativePostition, menuItems) {
		this.originElement = originElement;
		this.relativePostition = relativePostition;
		this.menuItems = menuItems;
	}

	id() {
		return this.originElement;
	}

	get placement() {
		return this.relativePosition;
	}

	menuItems() {
		return this.menuItems;
	}
}

//initalize menuItems dictionary
menus = {
	title: "Top-Level",
	items: [{
		title: "Sub_1_1",
		items: []
	}, {
		title: "Sub_1_2",
		items: []
	}, {
		title: "Sub_1_3",
		items: [{
			title: "Sub_1_3_0",
			items: []
		}, {
			title: "Sub_1_3_1",
			items: [{
				title: "Sub_1_3_1_1",
				items: []
			}, {
				title: "Sub_1_3_1_2",
				items: []
			}]
		}, {
			title: "Sub_1_3_2",
			items: []
		}, {
			title: "Sub_1_3_4",
			items: [{
				title: "Sub_1_3_4_1",
				items: []
			}, {
				title: "Sub_1_3_4_2",
				items: []
			}]
		}]
	}, {
		title: "Sub_1_4",
		items: [{
			title: "Sub_1_4_1",
			items: []
		}]
	}]
};

//element popover
//same id as the link where I want the popover to show up
var element = new Element(".popover-markup", "bottom", menus);
var element2 = new Element(".popover-markup", "bottom", menus);

//takes an array of menus & submenus, and the element variable
//they need to go
function generateList(data, e) {

	//can recursively add submenus
	var createInner = function(obj) {
		var li = $(`<li>`),
			innerList,
			subMenu;

		if (0 < obj.items.length) {
			innerList = $('<ul class="dropdown-menu sub-menu">');
			for (var i = 0, l = obj.items.length; i < l; i++) {
				subMenu = obj.items[i];
				innerList.append(createInner(subMenu));
			}
			li.append(`<a class="trigger right-caret">` + obj.title + `</a>`).append(innerList);
		}
		else {
			//double li tags cancel out
			//append single item
			li.append(`<li><a href="#" class="item">` + obj.title + `</a></li>`);
		}
		return li;
	};
	
	var base = $(e);
	//once submenus are constructed, then add them to the parentList
	for (var i = 0, l = data.length; i < l; i++) {
		base.append(createInner(data[i]));
	}

}

//used to distinguish the items within the popover
subMenuCount = 0;
//document functions
$(document).ready(function() {
	//when the popover is triggered
	$(element.id()+`>.trigger`).popover({
		title: "Contents",
		placement: element.relativePostition,
		html: element.menuItems.title,
		// build the initail menu within the popover
		// which is different than the ones created in the dropdowns
		// ************* reason for creating seperate method to handle it
		content: function() {
			//clear out the test data within content
			$(".content").empty();
			// for every element within the sub menu
			$.each(element.menuItems.items, function(i) {
				// if it has more children
				if (element.menuItems.items[i].items.length > 0) {
					//set up the nessecary tags according to the bootstrap documentation 
					$(".content").append($(`<div class="dropdown" id="menu` + subMenuCount + `">`).append($(
						`<a href="#" data-toggle="dropdown" class="dropdown-toggle">` + element.menuItems
						.items[i].title + `<b class="caret"></b></a>`)).append(`<ul class="dropdown-menu">`));
					//generate sub menu
					generateList(element.menuItems.items[i].items, '.content>#menu' + subMenuCount +'>.dropdown-menu'); //function call
					subMenuCount++;
				}
				// if it doesn't have children, add it to the popover
				else {
					$(".content").append(`<a href="#" class="dropdown-toggle item">` + element.menuItems.items[
						i].title + `</a>`);
				}
			});
			return $(this).parent().find('.content').html();
		}
	});

	//function that handles the dropdown
	$(function() {
		//add a handler to all a.trigger elements:
		//those are the ones that should be able to 
		$('body').on("click", ".dropdown-menu > li > a.trigger", function(e) {

			var current = $(this).next();
			var grandparent = $(this).parent().parent();

			if ($(this).hasClass('left-caret') || $(this).hasClass('right-caret'))
				$(this).toggleClass('right-caret left-caret');

			//find siblings (children of our grandparent that have a left caret and aren't me)  
			grandparent.find('.left-caret').not(this).toggleClass('right-caret left-caret');
			grandparent.find(".sub-menu:visible").not(current).hide();
			//turn off their carets, close their submenus

			//turn on my submenu
			current.toggle();
			e.stopPropagation();
			//highlights selection
			if ( !$(this).hasClass("highlight") ) {
				$(this).closest('a').addClass('highlight');
			} else {
				$(this).closest('a').removeClass('highlight');
			}
			//$(this).closest('a').toggleClass("highlight");
		});

		//add a handle to all elements that arent submenu triggers
		$('body').on("click", ".dropdown-menu > li > a:not(.trigger)", function() {
			//hide other all submenus in my dropdown
			var root = $(this).closest('.dropdown');
			root.find('.left-caret').toggleClass('right-caret left-caret');
			root.find('.sub-menu:visible').hide();
			//console.log(root.text());
		});
		
		//add a handle to all elements that dont have submenus - can uniquely distinguish them
		$('body').on("click", "li > a.item" , function() {
			//hide other all submenus in my dropdown
			var root = $(this);
			console.log(root.text());
		});
		
		$('body').on("click", ".content>.popover-content>a.item", function() {
			//hide other all submenus in my dropdown
			var root = $(this);
			console.log(root.text());
		});
	});
});