using Microsoft.EntityFrameworkCore.Migrations;

namespace TooShortWillRead.DAL.Migrations
{
    public partial class AddOriginalUrlColumnForArticlesTable : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "OriginalUrl",
                table: "Articles",
                type: "nvarchar(max)",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "OriginalUrl",
                table: "Articles");
        }
    }
}
