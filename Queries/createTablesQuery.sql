


IF OBJECT_ID('dbo.Users_Favorites', 'U') IS NOT NULL
DROP TABLE dbo.Users_Favorites
GO

IF OBJECT_ID('dbo.Users_Watched', 'U') IS NOT NULL
DROP TABLE dbo.Users_Watched
GO

IF OBJECT_ID('dbo.Users_Recipes', 'U') IS NOT NULL
DROP TABLE dbo.Users_Recipes
GO

IF OBJECT_ID('dbo.Users_FamilyRecipes', 'U') IS NOT NULL
DROP TABLE dbo.Users_FamilyRecipes
GO

IF OBJECT_ID('dbo.Users', 'U') IS NOT NULL
DROP TABLE dbo.Users
GO

CREATE TABLE dbo.Users
(
    userName [NVARCHAR](50) NOT NULL PRIMARY KEY,
    firstname [NVARCHAR](50) NOT NULL,
    lastname [NVARCHAR](50) NOT NULL,
    password [NVARCHAR](max) NOT NULL,
    email [NVARCHAR](50) NOT NULL,
    photoUrl [NVARCHAR](50) NOT NULL,
    country [NVARCHAR](50) NOT NULL
    
);
GO

CREATE TABLE dbo.Users_Favorites
(
    userName [NVARCHAR](50) NOT NULL FOREIGN KEY REFERENCES Users(userName), 
    recipe_id INTEGER NOT NULL PRIMARY KEY
);
GO

CREATE TABLE dbo.Users_Watched
(
    userName [NVARCHAR](50) NOT NULL FOREIGN KEY REFERENCES Users(userName), 
    recipe_id INTEGER NOT NULL PRIMARY KEY,
    seq INTEGER NOT NULL
);
GO

CREATE TABLE dbo.Users_Recipes
(
    userName [NVARCHAR](50) NOT NULL FOREIGN KEY REFERENCES Users(userName), 
    recipe_id INTEGER NOT NULL PRIMARY KEY
);
GO

CREATE TABLE dbo.Users_FamilyRecipes
(
    userName [NVARCHAR](50) NOT NULL FOREIGN KEY REFERENCES Users(userName), 
    recipe_id INTEGER NOT NULL PRIMARY KEY
);
GO

DECLARE @HashThis nvarchar(max);  
SET @HashThis = lower(CONVERT(varchar(max), HASHBYTES('SHA2_256', 'test'), 2));
INSERT INTO Users
 ([userName],[firstname],[lastname], [password],[email],[photoUrl],[country])
VALUES
    (N'test', N'TestF',N'TestL',@HashThis, N'test@test.com',N'testPhotoUrl',N'testCountry'),
    (N'alongo', N'alon',N'golombek',@HashThis, N'a@g.com',N'dummyURL',N'israel')
GO


INSERT INTO Users_Favorites
 ([userName],[recipe_id])
VALUES
    (N'test', 123),
    (N'test', 345),
    (N'alongo', 456)
GO

INSERT INTO Users_Watched
 ([userName],[recipe_id],[seq])
VALUES
    (N'test', 123, 1),
    (N'test', 345, 2),
    (N'test', 567, 3)
GO

INSERT INTO Users_Recipes
 ([userName],[recipe_id])
VALUES
    (N'test', 123),
    (N'test', 345),
    (N'alongo', 456)
GO

INSERT INTO Users_FamilyRecipes
 ([userName],[recipe_id])
VALUES
    (N'test', 123),
    (N'test', 345),
    (N'alongo', 456)
GO

