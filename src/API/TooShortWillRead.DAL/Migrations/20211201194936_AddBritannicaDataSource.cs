using Microsoft.EntityFrameworkCore.Migrations;

namespace TooShortWillRead.DAL.Migrations
{
    public partial class AddBritannicaDataSource : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "DataSource",
                columns: new[] { "Id", "Name" },
                values: new object[] { 3, "Britannica" });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "DataSource",
                keyColumn: "Id",
                keyValue: 3);
        }
    }
}
