module browse { export var html =  '<div id="container">	<div id="header-bar">		<div id="header">			<div id="header-logo">				&#67;roissant			</div>			<div id="header-search">				<input type="text" placeholder="Search by name, artist, etc.">			</div>			<div id="header-tabs">				<button class="header-tab selected">Google Drive</button><button class="header-tab">My Playlist</button>			</div>		</div>	</div>	<div id="main">		<div id="sidebar">			<ul id="sidebar-folders">				<li>					<span class="folder"></span><span class="child" style="width: 200px" ng-click="vm.select(\'root\')">My Drive</span>				</li>				<li style="padding-left: {{10 * $index}}px" class="{{$index == 0 ? \'deep\' : \'deeper\'}}" ng-repeat="ancestor in vm.ancestors">					<span class="L"></span><span class="folder"></span><span class="child" style="width: {{200 - 10 * $index}}px" ng-click="vm.select(ancestor.id)">{{ancestor.name}}</span>				</li>				<li style="padding-left: {{10 * vm.ancestors.length}}px" class="{{vm.path.length == 0 ? \'deep\' : \'deeper\'}}" ng-repeat="child in vm.children">					<span class="L"></span><span class="folder"></span><span class="child" style="width: {{180 - 10 * vm.ancestors.length}}px" ng-click="vm.select(child.id)">{{child.name}}</span>				</li>			</ul>		</div>		<div id="content">			<div id="tracklist">				<div id="tracklist-album-detail">					<div id="tracklist-album-art">						<img src="http://www.muumuse.com/wp-content/uploads/2011/01/adele-21.jpeg">					</div>					<div id="tracklist-album-title">						Adele_21					</div>					<div id="tracklist-album-options">						⊕⊕					</div>				</div>				<div id="tracklist-album-data">					<div>Tracks</div>					<ul id="tracklist-tracks">						<li ng-repeat="track in vm.tracks">{{track}}</li>					</ul>				</div>			</div>		</div>	</div>	<div id="player-bar">		<div id="player">		</div>	</div></div>' } 