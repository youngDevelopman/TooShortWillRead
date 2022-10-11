using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TooShortWillRead.DAL.Migrations
{
    public partial class AddHistoryComDataSource : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "DataSource",
                columns: new[] { "Id", "Name" },
                values: new object[] { 4, "HistoryCom" });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "DataSource",
                keyColumn: "Id",
                keyValue: 4);
        }
    }
}
