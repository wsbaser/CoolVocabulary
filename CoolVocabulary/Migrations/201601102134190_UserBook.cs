namespace CoolVocabulary.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class UserBook : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.UserBooks",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        BookId = c.Int(nullable: false),
                        UserId = c.String(nullable: false, maxLength: 128),
                        LearnLevels = c.String(),
                        LearnDates = c.String(),
                        ExamDates = c.String(),
                        FirstPromoteDates = c.String(),
                        LastPromoteDates = c.String(),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Books", t => t.BookId, cascadeDelete: true)
                .ForeignKey("dbo.AspNetUsers", t => t.UserId, cascadeDelete: true)
                .Index(t => new { t.BookId, t.UserId }, unique: true, name: "UQ_UserID_BookId");


            Sql("INSERT INTO dbo.\"UserBooks\" (\"UserId\",\"BookId\") SELECT \"UserId\",\"Id\" FROM dbo.\"Books\"");

            AddColumn("dbo.Books", "IsPublished", c => c.Boolean());
            AddColumn("dbo.Books", "Description", c => c.String());
            DropColumn("dbo.BookWords", "LearnedAt");
            DropColumn("dbo.Translations", "LearnLevel");
            DropColumn("dbo.Translations", "ExaminedAt");
        }
        
        public override void Down()
        {
            AddColumn("dbo.Translations", "ExaminedAt", c => c.Long(nullable: false));
            AddColumn("dbo.Translations", "LearnLevel", c => c.Int(nullable: false));
            AddColumn("dbo.BookWords", "LearnedAt", c => c.Long(nullable: false));
            DropForeignKey("dbo.UserBooks", "UserId", "dbo.AspNetUsers");
            DropForeignKey("dbo.UserBooks", "BookId", "dbo.Books");
            DropIndex("dbo.UserBooks", "UQ_UserID_BookId");
            DropColumn("dbo.Books", "Description");
            DropColumn("dbo.Books", "IsPublished");
            DropTable("dbo.UserBooks");
        }
    }
}
