CREATE PROCEDURE [dbo].[spUser_Update]
	@id INT,
	@FirstName NVARCHAR(50),
	@LastName NVARCHAR(50)
AS
begin
	update [dbo].[User] set FirstName = @FirstName, LastName = @LastName where Id = @id;
end
