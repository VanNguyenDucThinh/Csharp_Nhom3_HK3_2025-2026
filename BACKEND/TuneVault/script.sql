Create database TuneVaultDB
Go

Use TuneVaultDB
Go

--Table user
create table UserProfile(
	Id UNIQUEIDENTIFIER not null default NEWID() primary key,
	[Name] nvarchar(50) not null,
	Email nvarchar(150) not null unique,
	AvatarUrl VARCHAR(max) NULL,
	Bio NVARCHAR(max) NULL,
	[Password] varchar(255) not null
);
Go

--Table media
CREATE TABLE MediaItems (
    Id UNIQUEIDENTIFIER PRIMARY KEY,               
    Title NVARCHAR(255) NULL,                      
    Description NVARCHAR(MAX) NULL,                
    Category INT NOT NULL,                         
    MediaStyle INT NOT NULL,                       
    UrlImageMedia NVARCHAR(MAX) NULL,              
    ViewCount BIGINT NOT NULL DEFAULT 0,           
    UrlMediaItem NVARCHAR(MAX) NOT NULL,           
    Owner UNIQUEIDENTIFIER NOT NULL,               
    UploadDateMediaItem DATETIME2 NOT NULL DEFAULT GETUTCDATE(), 
    IdAlbum UNIQUEIDENTIFIER NULL                  
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
		References UserProfile(Id) on delete cascade
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
		References MediaItems(Id) on delete cascade
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
		references MediaItems(Id) on delete set null,

	Constraint MediaShare_IdPlayList_Fkey foreign key(IdPlayList)
		references PlayList(Id) on delete set null,

	constraint MediaShare_IdSender_Fkey foreign key(IdSender)
		references UserProfile(Id),
	constraint MediaShare_IdReceiver_Fkey foreign key(IdReceiver)
		references UserProfile(Id)

);
Go

--Table notification
create table Notification(
	Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWSEQUENTIALID(),
	IdUser UNIQUEIDENTIFIER NOT NULL,
	[Type] int not null,
	Payload NVARCHAR(MAX) NOT NULL

	constraint notification_IdUser_Fkey foreign key(IdUser)
		references UserProfile(Id)
);
Go

--table favorite
create table Favorite(
	IdUser UNIQUEIDENTIFIER NOT NULL,
	IdMediaItem UNIQUEIDENTIFIER not null,
	FavoriteAt DATETIME2 NOT NULL,

	PRIMARY KEY (IdUser, IdMediaItem),

	constraint Favorite_IdUser_Fkey foreign key(IdUser)
		references UserProfile(Id) on delete cascade,

	Constraint Favorite_IdMediaItem_FKey foreign key(IdMediaItem)
		References MediaItems(Id) on delete cascade
);
Go

--table History
create table PlayHistory(
	IdPlayHistory UNIQUEIDENTIFIER NOT NULL default NEWID() primary key,
	IdUser UNIQUEIDENTIFIER NOT NULL,
	IdMediaItem UNIQUEIDENTIFIER not null,
	PlayAt datetime2 not null

	constraint PlayHistory_IdUser_Fkey foreign key(IdUser)
		references UserProfile(Id) on delete cascade,
	Constraint PlayHistory_IdMediaItem_FKey foreign key(IdMediaItem)
		References MediaItems(Id) on delete cascade

);
Go

--table follow
create table Follow(
	IdFollower UNIQUEIDENTIFIER not null,
	IdFollowing UNIQUEIDENTIFIER not null,
	FollowAt datetime2 not null

	constraint Follow_IdFollower_Fkey foreign key(IdFollower)
		references UserProfile(Id) on delete no action,
	constraint Follow_IdFollowing_Fkey foreign key(IdFollowing)
		references UserProfile(Id) on delete no action,
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

--table RefreshToken
create table RefreshToken(
    Id UNIQUEIDENTIFIER primary key default NEWID() not null,
    UserId UNIQUEIDENTIFIER not null,
    Token varchar(255) not null,
    ExpiryDate datetime2 not null,
    IsUsed bit not null default 0,
    IsRevoked bit not null default 0,
    constraint RefreshToken_UserId_Fkey foreign key(UserId)
        references UserProfile(Id) on delete cascade
);
Go 
CREATE NONCLUSTERED INDEX IX_RefreshToken_Token ON RefreshToken(Token); 
GO
