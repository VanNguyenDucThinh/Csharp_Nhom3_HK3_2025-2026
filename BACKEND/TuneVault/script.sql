Create database TuneVaultDB
Go

Use TuneVaultDB
Go

--Table user
create table UserProfile(
	UserId UNIQUEIDENTIFIER not null default NEWID() primary key,
	[Name] nvarchar(50) not null,
	Email nvarchar(150) not null unique,
	AvatarUrl VARCHAR(max) NULL,
	DateOfBirth DATETIME2 NOT NULL,
	Bio NVARCHAR(max) NULL,
	UserName varchar(50) NOT NULL UNIQUE, --loginName
	[Password] varchar(255) not null
);
Go

--Table media
create table MediaItem(
	Id UNIQUEIDENTIFIER primary key,
	Title nvarchar(255) not null, 
	[Description] NVARCHAR(MAX) NULL,
	CategoryId INT NOT NULL,
	Duration int not null,
	MediaStyleId INT NOT NULL,
	UrlMediaItem VARCHAR(2048) NOT NULL,
	OwnerMediaItem UNIQUEIDENTIFIER NOT NULL,
	UploadDateMediaItem  datetime2 not null
);
Go

--table playlist
create table PlayList(
	Id UNIQUEIDENTIFIER primary key,
	[Name] varchar(255) not null,
	IsPublic bit not null default 1, --0:Private|1:not Private
	CreateDate datetime2 not null ,
	[Owner] UNIQUEIDENTIFIER not null

	Constraint PlayList_Owner_FKey foreign key([Owner])
		References UserProfile(UserId) on delete cascade
);
Go

--Table TrackPlayList
create table PlayListTrack(
	IdPlaylist UNIQUEIDENTIFIER not null,
	IdMediaItem UNIQUEIDENTIFIER not null,
	AddAt datetime2 not null,
	Primary Key (IdPlaylist , IdMediaItem),

	Constraint PlayListTrack_IdPlaylist_FKey foreign key(IdPlaylist)
		References PlayList(Id) on delete cascade,

	Constraint PlayListTrack_IdMediaItem_FKey foreign key(IdMediaItem)
		References MediaItem(Id) on delete cascade
);
Go

--Table MediaShare
create table MediaShare(
	IdSender UNIQUEIDENTIFIER not null,
	IdReceiver UNIQUEIDENTIFIER not null,
	IdMediaItem UNIQUEIDENTIFIER null,
	IdPlayList UNIQUEIDENTIFIER null,
	ShareAt DATETIME2 not null

	Constraint MediaShare_IdMediaItem_Fkey foreign key(IdMediaItem)
		references MediaItem(Id) on delete set null,

	Constraint MediaShare_IdPlayList_Fkey foreign key(IdPlayList)
		references PlayList(Id) on delete set null,

	constraint MediaShare_IdSender_Fkey foreign key(IdSender)
		references UserProfile(UserId),
	constraint MediaShare_IdReceiver_Fkey foreign key(IdReceiver)
		references UserProfile(UserId)

);
Go

--Table notification
create table Notification(
	Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWSEQUENTIALID(),
	IdUser UNIQUEIDENTIFIER NOT NULL,
	[Type] int not null,
	Payload NVARCHAR(MAX) NOT NULL

	constraint notification_IdUser_Fkey foreign key(IdUser)
		references UserProfile(UserId)
);
GO

--table favorite
create table Favorite(
	IdUser UNIQUEIDENTIFIER NOT NULL,
	IdMediaItem UNIQUEIDENTIFIER not null,
	FavoriteAt DATETIME2 NOT NULL,

	PRIMARY KEY (IdUser, IdMediaItem),

	constraint Favorite_IdUser_Fkey foreign key(IdUser)
		references UserProfile(UserId) on delete cascade,

	Constraint Favorite_IdMediaItem_FKey foreign key(IdMediaItem)
		References MediaItem(Id) on delete cascade
);
Go

--table History
create table PlayHistory(
	IdUser UNIQUEIDENTIFIER NOT NULL,
	IdMediaItem UNIQUEIDENTIFIER not null,
	PlayAt datetime2 not null

	constraint PlayHistory_IdUser_Fkey foreign key(IdUser)
		references UserProfile(UserId) on delete cascade,
	Constraint PlayHistory_IdMediaItem_FKey foreign key(IdMediaItem)
		References MediaItem(Id) on delete cascade

);
Go

--table follow
create table Follow(
	IdFollower UNIQUEIDENTIFIER not null,
	IdFollowing UNIQUEIDENTIFIER not null,
	FollowAt datetime2 not null

	constraint Follow_IdFollower_Fkey foreign key(IdFollower)
		references UserProfile(UserId) on delete no action,
	constraint Follow_IdFollowing_Fkey foreign key(IdFollowing)
		references UserProfile(UserId) on delete no action,
);
Go

--table album
create table Album(
	IdAlbum UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWSEQUENTIALID(),
	Title nvarchar(max) not null,
	ReleaseDate datetime2 not null,
	CoverImageUrl varchar(max) not null,
	ArtistId UNIQUEIDENTIFIER not null

	constraint Album_ArtistId_Fkey foreign key (ArtistId)
		references Artist(Id) on delete cascade
);
Go

--table artist
create table Artist(
	Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWSEQUENTIALID(),
	IdUserProfile UNIQUEIDENTIFIER not null,
	NameArtist nvarchar(150) null,
	IsVerified bit not null default 0 --0:chua

	constraint Artist_IdUserProfile_FKey foreign key (IdUserProfile) 
        references UserProfile(UserId) on delete cascade
);
Go

--table MediaItem_Artist
create table MediaItem_Artist(
	IdMediaItem UNIQUEIDENTIFIER not null,
	IdArtist UNIQUEIDENTIFIER not null,

	primary key(IdMediaItem , IdArtist),

	constraint MediaItemArtist_IdMediaItem_FKey foreign key (IdMediaItem) 
        references MediaItem(Id) on delete cascade,
        
    constraint MediaItemArtist_IdArtist_FKey foreign key (IdArtist) 
        references Artist(Id) on delete cascade
);
Go