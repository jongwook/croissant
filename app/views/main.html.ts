module main { export var html =  '<div id="container">	<div id="header-bar">		<div id="header">			<div id="header-logo">				&#67;roissant			</div>			<div id="header-search">				<input type="text" placeholder="Search by name, artist, etc.">			</div>			<div id="header-tabs">				<button class="header-tab selected">Google Drive</button><button class="header-tab">My Playlist</button>			</div>		</div>	</div>	<div id="main">		<div id="sidebar">			<ul id="sidebar-parents" ng-init="path=[\'path\',\'to\',\'folder\']">				<li style="padding-left: {{20 * $index}}px" ng-repeat="item in path">					<span class="L"></span><span class="folder"></span><span class="child">{{item}}</span>				</li>			</ul>			<ul id="sidebar-children" ng-init="children=[\'Adele_21\', \'Adele_22\', \'Adele_23\']; depth=2">				<li style="padding-left: {{20 * path.length}}px" ng-repeat="child in children">					<span class="L"></span><span class="folder"></span><span class="child">{{child}}</span>				</li>			</ul>		</div>		<div id="content">			<div id="tracklist">				<div id="tracklist-album-detail">					<div id="tracklist-album-art">						<img src="http://www.muumuse.com/wp-content/uploads/2011/01/adele-21.jpeg">					</div>					<div id="tracklist-album-title">						Adele_21					</div>					<div id="tracklist-album-options">						⊕⊕					</div>				</div>				<div id="tracklist-album-data">					<div>Tracks</div>					<ul id="tracklist-tracks" ng-init="tracks = [\'01 Rolling in the Deep\',\'02 Rumor has it\',\'03 Tuming Tables\',\'04 Dont You Remember\',\'05 Set Fire to the Rain\',\'06 He Wont Go\',\'07 Take It All\',\'08 Ill Be Waiting\',\'09 One and Only\',\'10 Lovesong\',\'11 Someone Like You\']">						<li ng-repeat="track in tracks">{{track}}</li>					</ul>				</div>			</div>		</div>	</div>	<div id="player-bar">		<div id="player">		</div>	</div></div>' } 