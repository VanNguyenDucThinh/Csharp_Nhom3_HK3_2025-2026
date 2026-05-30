CREATE PROCEDURE [dbo].[spUser_GetAll]
AS
BEGIN
	select Id, FirstName, LastName from [dbo].[User];

END