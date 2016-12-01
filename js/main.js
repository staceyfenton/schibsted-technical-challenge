window.technicalTest = {
	init: function() {
		window.technicalTest.fetchData('/data/feed.json', function(data) {
			var technicalTest = new Vue({
				el: '#vue-app',

				data: {
					searchString: '',
					results: 10,
					filerLikes: false,
					videos: data
				},

				created: function () {
					// show the html
					document.getElementById('vue-app').className = '';
			  },

			  computed: {
			  	filteredVideos: function() {
						// declare variables
						var videosArray = this.videos.videos,
						searchString = this.searchString,
						likesFilter = this.filerLikes,
						maxResults = this.results;

			      // check if any filters have been used,
			      // if not, return the results - taking into account max. number to display
			      if(!searchString && !likesFilter) {
			      	return videosArray.slice(0, maxResults);
			      }

			      // filter description by search term
			      if(searchString) {
			      	searchString = searchString.trim().toLowerCase();

			      	videosArray = videosArray.filter(function(video) {
			      		// check if search term is found in the description
			      		var searchTermFound = (video.description.toLowerCase().indexOf(searchString) > -1) ? true : false;

			      		// check if user has more than 10 likes
			      		var aboveTenLikes = (video.user.metadata.connections.likes.total > 10) ? true : false;

			        	// is likes checkbox checked? If so we need to apply additional filter
			        	if(likesFilter) {
			        		if(searchTermFound && aboveTenLikes) {
			        			return video;
			        		}
			        	} else {
			        		if(searchTermFound) {
			        			return video;
			        		}
			        	}
			        });
			      } else {
			      	// filter users with more than 10 likes
			      	if(likesFilter) {
			      		videosArray = videosArray.filter(function(video) {
			      			if(video.user.metadata.connections.likes.total > 10) {
			      				return video;
			      			}
			      		})
			      	}
			      }

			      // Return an array with the filtered data up to maximum number of results
			      return videosArray.slice(0, maxResults);
			    }
			  }
			});

		});
	},

	fetchData: function (path, callback) {
		var httpRequest = new XMLHttpRequest();
		httpRequest.onreadystatechange = function() {
			if (httpRequest.readyState === 4) {
				if (httpRequest.status === 200) {
					var data = JSON.parse(httpRequest.responseText);
					if (callback) callback(data);
				}
			}
		};
		httpRequest.open('GET', path);
		httpRequest.send(); 
	}
};

window.technicalTest.init();