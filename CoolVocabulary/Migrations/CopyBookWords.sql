CREATE PROCEDURE dbo.CopyBookwords 
    @sourceBookId int, 
    @targetBookId int 
AS 
    SET NOCOUNT ON;
	-- copy BookWords
	insert into dbo.bookwords (bookid,wordid,speachpart,learnedat) 
	select @targetBookId,wordid,speachpart,0 
	from dbo.bookwords where bookid=@sourceBookId
	-- copy translations
	insert into translations (bookwordid,value,language,learnlevel,examinedat)
	select bwtarget.id, t.value, t.language, 0, 0
	from bookwords bwtarget 
		join bookwords bwsrc on bwtarget.wordid=bwsrc.wordid 
								and bwtarget.speachpart=bwsrc.speachpart
		join translations t on t.bookwordid=bwsrc.id
	where bwtarget.bookid = @targetBookId and bwsrc.bookid = @sourceBookId
GO