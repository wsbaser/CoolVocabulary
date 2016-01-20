namespace CoolVocabulary.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class UserBook : DbMigration
    {
        public override void Up()
        {
            DropIndex("dbo.Books", "UQ_UserID_Name_Language");
            DropIndex("dbo.Translations", "UQ_Value_Language_BookWordId");
            CreateTable(
                "dbo.MonthPlans",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        UserId = c.String(nullable: false),
                        Year = c.Int(nullable: false),
                        Month = c.Int(nullable: false),
                        Language = c.Int(nullable: false),
                        PlanedCount = c.Int(nullable: false),
                        LearnedCount = c.Int(),
                    })
                .PrimaryKey(t => t.Id)
                .Index(t => new { t.UserId, t.Year, t.Month, t.Language }, unique: true, name: "UQ_UserId_Date_Language");
            
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
                        PromoteDates = c.String(),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Books", t => t.BookId, cascadeDelete: true)
                .ForeignKey("dbo.AspNetUsers", t => t.UserId, cascadeDelete: true)
                .Index(t => new { t.BookId, t.UserId }, unique: true, name: "UQ_UserID_BookId");

            Sql("INSERT INTO dbo.\"UserBooks\" (\"UserId\",\"BookId\") SELECT \"UserId\",\"Id\" FROM dbo.\"Books\"");
            
            AddColumn("dbo.Books", "IsPublished", c => c.Boolean());
            AddColumn("dbo.Books", "Description", c => c.String());
            AlterColumn("dbo.Books", "Language", c => c.Short(nullable: false));
            AlterColumn("dbo.Translations", "Language", c => c.Short(nullable: false));
            CreateIndex("dbo.Books", new[] { "UserId", "Name", "Language" }, unique: true, name: "UQ_UserID_Name_Language");
            CreateIndex("dbo.Translations", new[] { "Value", "Language", "BookWordId" }, unique: true, name: "UQ_Value_Language_BookWordId");
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
            DropIndex("dbo.MonthPlans", "UQ_UserId_Date_Language");
            DropIndex("dbo.Translations", "UQ_Value_Language_BookWordId");
            DropIndex("dbo.Books", "UQ_UserID_Name_Language");
            AlterColumn("dbo.Translations", "Language", c => c.Int(nullable: false));
            AlterColumn("dbo.Books", "Language", c => c.Int(nullable: false));
            DropColumn("dbo.Books", "Description");
            DropColumn("dbo.Books", "IsPublished");
            DropTable("dbo.UserBooks");
            DropTable("dbo.MonthPlans");
            CreateIndex("dbo.Translations", new[] { "Value", "Language", "BookWordId" }, unique: true, name: "UQ_Value_Language_BookWordId");
            CreateIndex("dbo.Books", new[] { "UserId", "Name", "Language" }, unique: true, name: "UQ_UserID_Name_Language");
        }
    }
}
