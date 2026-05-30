CREATE PROCEDURE [dbo].[spUser_Delete]
	@Id INT
AS
begin
	delete from [dbo].[User] where Id = @Id;
end
