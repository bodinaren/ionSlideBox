angular.module('bodin', [])

	.directive('ionSlideBox', function ($ionicScrollDelegate, $timeout, $interval) {
	   return {
		  priority: 2,
		  link: function (scope, elem, attrs) {
			 var interval,
				 slides = elem.find("ion-slide");
			 
			 for (var i = 0; i < slides.length; i++) {
				angular.element(slides[i]).attr("active-slide", (i == 0));
			 }
			 
			 scope.$on("slideBox.slideChanged", function (slide, $index) {
				$interval.cancel(interval); // Make sure to reset this before we start.
				
				var newScrollPos = 0;
				
				angular.forEach(slides, function (s) {
				   var el = angular.element(s);
				   
				   if (el.attr("active-slide") == "true") {
					  el.attr("scroll-pos", $ionicScrollDelegate.getScrollPosition().top.toString());
				   }
				   
				   if (el.attr("data-index") == $index) {
					  if (!!el.attr("scroll-pos")) {
						 newScrollPos = parseFloat(el.attr("scroll-pos"));
					  }
					  el.attr("active-slide", "true").css("height", "").css("top", "");
				   } else {
					  el.attr("active-slide", "false")
						 .css("height", $ionicScrollDelegate.getScrollView().__clientHeight + "px")
						 .css("top", -$ionicScrollDelegate.getScrollPosition().top + "px");
				   }
				});
				
				$timeout(function () {
				   $ionicScrollDelegate.resize().then(function () {
					  // This promise doesn't actually guarantee that the size of the scrollView has changed yet.
					  // So we do an interval to make sure it's actually done.
					  interval = $interval(function () {
						 $ionicScrollDelegate.scrollTo($ionicScrollDelegate.getScrollPosition().left, newScrollPos, false);
						 if ($ionicScrollDelegate.getScrollPosition().top == newScrollPos) $interval.cancel(interval);
					  }, 10);
				   });
				});
			 });
			 
			 scope.$on("$destroy", function () {
				$interval.cancel(interval);
			 });
		  }
	   }
	});