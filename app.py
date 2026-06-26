import streamlit as st
import pandas as pd
import numpy as np
import plotly.graph_objects as go

# การตั้งค่าหน้าจอเบื้องต้นให้ดูเป็น Engineering Dashboard
st.set_page_config(
    page_title="Super Solar | Engineering Dashboard",
    page_icon="☀️",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Custom CSS เพื่อทำหน้าตาแบบ Dark Mode / Technical UI
st.markdown("""
<style>
    /* ปรับแต่งสีพื้นหลังหลัก */
    .stApp {
        background-color: #0E1117;
        color: #FAFAFA;
    }
    
    /* ปรับแต่งกล่องตัวเลข (Metrics) */
    div[data-testid="stMetricValue"] {
        color: #00FF41; /* Neon Green สำหรับตัวเลข */
        font-family: 'Courier New', Courier, monospace;
    }
    
    /* เส้นแบ่ง */
    hr {
        border-color: #333333;
    }
</style>
""", unsafe_allow_html=True)

# แถบด้านข้าง (Sidebar) สำหรับเครื่องมือป้อนข้อมูล
with st.sidebar:
    st.image("https://cdn-icons-png.flaticon.com/512/3135/3135694.png", width=50) # Placeholder logo
    st.title("⚙️ System Config")
    st.markdown("---")
    
    st.subheader("1. พลังงาน (Energy)")
    monthly_bill = st.number_input("ค่าไฟเฉลี่ยต่อเดือน (บาท)", min_value=0, value=3000, step=500)
    
    st.subheader("2. พื้นที่ (Area)")
    roof_area = st.slider("พื้นที่หลังคาคร่าวๆ (ตร.ม.)", min_value=10, max_value=200, value=50)
    
    st.markdown("---")
    st.button("⚡ วางแผงอัตโนมัติ (Auto-Stringing)", type="primary")

# พื้นที่แสดงผลหลัก (Main Dashboard)
st.title("☀️ Super Solar: Smart Installation Platform")
st.markdown("ออกแบบและประเมินระบบโซลาร์เซลล์ด้วยระบบจำลองอัจฉริยะ")

# ส่วนที่ 1: แดชบอร์ดสรุปตัวเลขแบบวิศวกรรม
col1, col2, col3, col4 = st.columns(4)

with col1:
    st.metric(label="System Size (kWp)", value="5.5", delta="Optimal")
with col2:
    st.metric(label="Modules (Panels)", value="10", delta="550W / Panel")
with col3:
    st.metric(label="Est. Monthly Savings (THB)", value=f"{monthly_bill * 0.6:,.0f}", delta="60% Reduction")
with col4:
    st.metric(label="Payback Period (Years)", value="3.8", delta="-1.2 yrs vs Avg", delta_color="inverse")

st.markdown("---")

# ส่วนที่ 2: พื้นที่ Map & Blueprint และ กราฟ
map_col, chart_col = st.columns([1.5, 1])

with map_col:
    st.subheader("🛰️ 3D Roof & Solar Heatmap (Blueprint View)")
    # Placeholder สำหรับพื้นที่วาดแผนที่ 3D (ในอนาคตอาจใช้ component อื่นมาใส่)
    st.info("Interactive Map Canvas (Google Maps / 3D Render) จะแสดงผลบริเวณนี้")
    
    # สร้างกราฟิกหลอกๆ เป็น Blueprint
    fig_map = go.Figure()
    fig_map.add_trace(go.Scatter(x=[0, 10, 10, 0, 0], y=[0, 0, 8, 8, 0], fill='toself', name='Roof Layout', line=dict(color='#00FF41')))
    fig_map.update_layout(
        plot_bgcolor='rgba(0,0,0,0)', paper_bgcolor='rgba(0,0,0,0)',
        xaxis=dict(showgrid=True, gridcolor='#333', zeroline=False),
        yaxis=dict(showgrid=True, gridcolor='#333', zeroline=False),
        title="Roof Polygon Bounds (CAD Mode)",
        font=dict(color="white"),
        margin=dict(l=0, r=0, t=30, b=0)
    )
    st.plotly_chart(fig_map, use_container_width=True)

with chart_col:
    st.subheader("📊 Financial & Energy Yield")
    
    # กราฟกระแสเงินสดจำลอง (Cash flow)
    years = np.arange(1, 26)
    cash_flow = -150000 + (np.array([monthly_bill * 0.6 * 12] * 25) * years)
    
    fig_finance = go.Figure()
    fig_finance.add_trace(go.Scatter(x=years, y=cash_flow, mode='lines+markers', name='Cumulative ROI', line=dict(color='#00E5FF', width=3)))
    fig_finance.add_hline(y=0, line_dash="dash", line_color="red", annotation_text="Break-even point")
    
    fig_finance.update_layout(
        plot_bgcolor='rgba(0,0,0,0)', paper_bgcolor='rgba(0,0,0,0)',
        xaxis_title="Years",
        yaxis_title="THB",
        title="25-Year Cash Flow Analysis",
        font=dict(color="white"),
        margin=dict(l=0, r=0, t=30, b=0)
    )
    st.plotly_chart(fig_finance, use_container_width=True)

st.markdown("---")
st.caption("Super Solar Prototype v0.1 | Engineered with Python & Streamlit")
